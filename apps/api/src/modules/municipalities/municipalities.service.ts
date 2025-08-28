import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Municipality} from "../../entities";
@Injectable()
export class MunicipalityService {
    constructor(
        @InjectRepository(Municipality)
        private readonly repo: Repository<Municipality>,
    ) {}

    /**
     * Liste mit einfachen Filtern und Pagination.
     * Verfügbare Filter: query (Name), land (2-stellig), regbez (1-stellig), kreis (2-stellig), gemeindeverband (4), gebietsstand (YYYY-MM-DD)
     */
    async list(params: {
        query?: string;
        land?: string;
        regbez?: string;
        kreis?: string;
        gemeindeverband?: string;
        gebietsstand?: string;
        page?: number;
        limit?: number;
    }) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(10000, Math.max(1, params.limit ?? 25));

        const qb = this.repo.createQueryBuilder('m');

        if (params.query) {
            qb.andWhere('LOWER(m.name) LIKE LOWER(:q)', { q: `%${params.query}%` });
        }
        if (params.land) qb.andWhere('m.land = :land', { land: params.land });
        if (params.regbez) qb.andWhere('m.regbez = :regbez', { regbez: params.regbez });
        if (params.kreis) qb.andWhere('m.kreis = :kreis', { kreis: params.kreis });
        if (params.gemeindeverband) qb.andWhere('m.gemeindeverband = :gvb', { gvb: params.gemeindeverband });
        if (params.gebietsstand) qb.andWhere('m.gebietsstand = :gs', { gs: params.gebietsstand });

        qb.orderBy('m.name', 'ASC').skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { page, limit, total, items, version: 'v1' };
    }

    async getByArs(ars: string) {
        return this.repo.findOne({ where: { ars } });
    }
}