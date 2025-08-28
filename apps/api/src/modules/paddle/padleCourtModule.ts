import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Kreis, Municipality, PadleCourt, Regbez, StagingJson, State, Verband} from "../../entities";
import {PadleCourtController} from "./padlecourt.controller";
import {PadleCourtService} from "./padlecourt.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Municipality, State, Kreis, Regbez, Verband, StagingJson, PadleCourt]),
    ],
    controllers: [PadleCourtController],
    providers: [PadleCourtService],
})
export class PadleCourtModule {}