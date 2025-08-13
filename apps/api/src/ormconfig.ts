import { DataSourceOptions } from 'typeorm';

const ormconfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'gvuser',
    password: process.env.DB_PASSWORD || 'changeme',
    database: process.env.DB_NAME || 'gvdb',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // Nur im DEV! Später Migrations nutzen
};
export default ormconfig;
