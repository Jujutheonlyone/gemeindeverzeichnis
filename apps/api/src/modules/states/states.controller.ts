import {StatesService} from "./states.service";
import {Controller, Get} from "@nestjs/common";

@Controller('v1/states')
export class StatesController {
    constructor(private readonly svc: StatesService) {}

    @Get()
    list() {
        return this.svc.list();
    }
}