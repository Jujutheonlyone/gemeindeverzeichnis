import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {MunicipalityService} from "./municipalities.service";
import {MunicipalityController} from "./municipalities.controller";
import {Kreis, Municipality, Regbez, StagingJson, State, Verband} from "../../entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([Municipality, State, Kreis, Regbez, Verband, StagingJson]),
    ],
    controllers: [MunicipalityController],
    providers: [MunicipalityService],
})
export class MunicipalitiesModule {}