import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'gvuser',
    password: process.env.DB_PASSWORD || 'changeme',
    database: process.env.DB_NAME || 'gvdb',
    entities: [],
    synchronize: false,
});