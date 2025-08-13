import {Controller, Get, Param, Query} from "@nestjs/common";
import {MunicipalityService} from "./municipalities.service";

@Controller('v1/municipalities')
export class MunicipalityController {
    constructor(private readonly svc: MunicipalityService) {}

    @Get()
    list(
        @Query('query') query?: string,
        @Query('land') land?: string,
        @Query('regbez') regbez?: string,
        @Query('kreis') kreis?: string,
        @Query('gemeindeverband') gemeindeverband?: string,
        @Query('gebietsstand') gebietsstand?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.svc.list({
            query,
            land,
            regbez,
            kreis,
            gemeindeverband,
            gebietsstand,
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
        });
    }

    @Get(':ars')
    get(@Param('ars') ars: string) {
        return this.svc.getByArs(ars);
    }
}