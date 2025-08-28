import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {MunicipalitiesModule} from "./modules/municipalities/municipalities.module";
import {StatesModule} from "./modules/states/states.module";
import {KreiseModule} from "./modules/kreise/kreise.module";
import {PadleCourtModule} from "./modules/paddle/padleCourtModule";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'gv2314!',
      database: process.env.DB_NAME || 'gvdb',
      synchronize: false,
      migrationsRun: false,
      autoLoadEntities: true,
    }),
    MunicipalitiesModule,
    StatesModule,
    PadleCourtModule,
    KreiseModule,
  ],
  providers: [AppService],
})
export class AppModule {}
