import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Kreis, Municipality, Regbez, StagingJson, State, Verband} from "../../entities";
import {StatesController} from "./states.controller";
import {StatesService} from "./states.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Municipality, State, Kreis, Regbez, Verband, StagingJson]),
    ],
    controllers: [StatesController],
    providers: [StatesService],
})
export class StatesModule {}