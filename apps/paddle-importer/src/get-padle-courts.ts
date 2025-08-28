import * as cheerio from "cheerio";
import { PaddleCourt } from "./types";

const LIST_URL = "https://padelfinder.de/";

function toAbsoluteUrl(href: string, base = LIST_URL): string {
    try {
        return new URL(href, base).toString();
    } catch {
        return href;
    }
}

function normText(t?: string | null): string {
    return (t ?? "").replace(/\s+/g, " ").trim();
}

async function fetchHtml(url: string): Promise<string> {
    const res = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (compatible; PadelfinderScraper/1.0; +https://example.com/bot)",
            "Accept-Language": "de,en;q=0.8",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
}

async function scrapeList(): Promise<{ name: string; detailUrl: string }[]> {
    const html = await fetchHtml(LIST_URL);
    const $ = cheerio.load(html);

    const container = $("#em-locations-list-1921564954");
    let items: cheerio.Cheerio<any>;
    if (container.length) {
        items = container.find(".locationinlist");
    } else {
        items = $(".locationinlist");
    }

    const results: { name: string; detailUrl: string }[] = [];
    items.each((_: any, el: any) => {
        const a = $(el).find(".locationname a").first();
        const name = normText(a.text());
        const href = a.attr("href");
        if (name && href) {
            results.push({ name, detailUrl: toAbsoluteUrl(href) });
        }
    });
    return results;
}

function parseCourtCounts($: cheerio.CheerioAPI) {
    let indoor = 0,
        outdoor = 0,
        single = 0;

    $("#locationanschrift .courts p").each((_, p) => {
        const countTxt = normText($(p).find(".wievielecourts").text());
        const label = normText($(p).find(".welchecourts").text());
        const n = parseInt(countTxt || "0", 10) || 0;

        if (/^indoor/i.test(label)) indoor = n;
        else if (/^outdoor/i.test(label)) outdoor = n;
        else if (/einzel/i.test(label)) single = n;
    });

    return { indoor, outdoor, single };
}

function parseContactBlock($: cheerio.CheerioAPI) {
    const getMeta = (label: string) => {
        const span = $(`#locationanschrift .metalabel`)
            .filter((_, el) => normText($(el).text()) === label)
            .first();
        if (!span.length) return "";
        const val = span.next(".metawert");
        const a = val.find("a").first();
        return normText(a.attr("href") || a.text());
    };

    let website = getMeta("Web:");
    if (website.startsWith("http")) {
    } else if (website) {
        website = toAbsoluteUrl(website);
    }

    let phone = getMeta("Telefon:");
    if (phone.startsWith("tel:")) phone = phone.replace(/^tel:/i, "").trim();

    let email = getMeta("E-Mail:");
    if (email.startsWith("mailto:")) email = email.replace(/^mailto:/i, "").trim();

    const addrAnchor = $("#locationanschrift p.anschrift a").first();
    let street = "";
    let zip = "";
    if (addrAnchor.length) {
        const lines = addrAnchor.text().split(/\n+/).map((s) => normText(s)).filter(Boolean);
        if (lines[0]) street = lines[0];
        if (lines[1]) {
            const m = lines[1].match(/\b(\d{5})\b/);
            if (m) zip = m[1];
        }
    }

    const name = normText($("#locationanschrift .anschrift .locationname").text());
    return { website, phone, email, street, zip, name };
}

async function scrapeDetail(detailUrl: string) {
    const html = await fetchHtml(detailUrl);
    const $ = cheerio.load(html);

    const { indoor, outdoor, single } = parseCourtCounts($);
    const { website, phone, email, street, zip, name } = parseContactBlock($);

    const description = "";

    return {
        website,
        phone,
        email,
        street,
        zip,
        name,
        indoorCourtsCount: indoor,
        outdoorCourtsCount: outdoor,
        singleCourtsCount: single,
        description,
    };
}

/** Öffentliche API: befüllt PaddleCourt[] komplett */
export async function getPadleCourts(): Promise<PaddleCourt[]> {
    const list = await scrapeList();
    const results: PaddleCourt[] = [];

    // Du kannst das parallelisieren; hier bewusst seriell, um die Seite nicht zu überlasten.
    for (const { name: listName, detailUrl } of list) {
        try {
            const detail = await scrapeDetail(detailUrl);
            results.push({
                name: detail.name || listName,
                website: detail.website || '',
                phone: detail.phone,
                email: detail.email,
                street: detail.street,
                zip: detail.zip,
                indoorCourtsCount: detail.indoorCourtsCount,
                outdoorCourtsCount: detail.outdoorCourtsCount,
                singleCourtsCount: detail.singleCourtsCount,
                description: detail.description,
            });
        } catch (e) {
            results.push({
                name: listName,
                website: detailUrl,
                phone: "",
                email: "",
                street: "",
                zip: "",
                indoorCourtsCount: 0,
                outdoorCourtsCount: 0,
                singleCourtsCount: 0,
                description: "",
            });
            console.warn(`Detail scrape failed for ${detailUrl}: ${(e as Error).message}`);
        }
    }

    return results;
}
