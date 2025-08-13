import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Kreis, Municipality, Regbez, StagingJson, State, Verband} from "../../entities";
import {KreisController} from "./kreise.controller";
import {KreisService} from "./kreise.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Municipality, State, Kreis, Regbez, Verband, StagingJson]),
    ],
    controllers: [KreisController],
    providers: [KreisService],
})
export class KreiseModule {}