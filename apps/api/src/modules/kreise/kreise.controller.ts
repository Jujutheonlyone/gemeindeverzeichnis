import {KreisService} from "./kreise.service";
import {Controller, Get} from "@nestjs/common";

@Controller('v1/kreise')
export class KreisController {
    constructor(private readonly svc: KreisService) {}

    @Get()
    list() {
        return this.svc.list();
    }
}