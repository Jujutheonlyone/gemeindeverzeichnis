import {Controller, Get, Param, Query} from "@nestjs/common";
import {MunicipalityService} from "./municipalities.service";
import {MunicipalityListQueryDto} from "./municipality-list.query.dto";

@Controller('v1/municipalities')
export class MunicipalityController {
    constructor(private readonly svc: MunicipalityService) {}

    @Get()
    list(@Query() q: MunicipalityListQueryDto) {
        return this.svc.list(q);
    }

    @Get(':ars')
    get(@Param('ars') ars: string) {
        return this.svc.getByArs(ars);
    }
}