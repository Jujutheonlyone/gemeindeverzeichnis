import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {ApiOkResponse, ApiOperation, ApiProperty, ApiTags} from '@nestjs/swagger';

export class HealthResponse {
    @ApiProperty({ example: true, description: 'Gesamtstatus der API' })
    ok!: boolean;

    @ApiProperty({ example: 'up', enum: ['up', 'down'], description: 'Status der Datenbankverbindung' })
    db!: 'up' | 'down';
}
@ApiTags('system')
@Controller('health')
export class HealthController {
    constructor(private readonly dataSource: DataSource) {}

    @Get()
    @ApiOperation({ summary: 'Healthcheck der Gemeindeverzeichnis-API & DB' })
    @ApiOkResponse({ type: HealthResponse })
    async health(): Promise<HealthResponse> {
        try {
            await this.dataSource.query('SELECT 1');
            return { ok: true, db: 'up' };
        } catch {
            return { ok: false, db: 'down' };
        }
    }
}
