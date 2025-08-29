import {AppDataSource} from "./datasource";

async function main() {
    const ds = await AppDataSource.initialize();
    try {
        const res = await ds.runMigrations();
        console.log(`Applied ${res.length} migration(s).`);
    } finally {
        await ds.destroy();
    }
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});