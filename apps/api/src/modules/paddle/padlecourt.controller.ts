import {PadleCourtService} from "./padlecourt.service";
import {Controller, Get} from "@nestjs/common";

@Controller('v1/padlecourts')
export class PadleCourtController {
    constructor(private readonly svc: PadleCourtService) {}

    @Get()
    list() {
        return this.svc.list();
    }
}