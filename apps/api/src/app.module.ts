import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Bootstrap} from "./entities/bootstrap.entitiy";
import ormconfig from "./ormconfig";
import {HealthController} from "./controllers/healt.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Bootstrap]),
  ],
  controllers: [HealthController],
  providers: [AppService],
})
export class AppModule {}
