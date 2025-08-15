import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MunicipalityListQueryDto {
    @ApiPropertyOptional({ description: 'Land (ARS2)', example: '09' })
    @IsOptional() @Matches(/^\d{2}$/)
    land?: string;

    @ApiPropertyOptional({ description: 'Regierungsbezirk (ARS1)', example: '1' })
    @IsOptional() @Matches(/^\d{1}$/)
    regbez?: string;

    @ApiPropertyOptional({ description: 'Kreis (ARS2 innerhalb Landes-ARS)', example: '62' })
    @IsOptional() @Matches(/^\d{2}$/)
    kreis?: string;

    @ApiPropertyOptional({ description: 'Gemeindeverband (ARS4)', example: '0916' })
    @IsOptional() @Matches(/^\d{4}$/)
    gemeindeverband?: string;

    @ApiPropertyOptional({ description: 'Stichtag (YYYY-MM-DD)', example: '2025-06-30' })
    @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/)
    gebietsstand?: string;

    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 25, minimum: 1 })
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    limit?: number = 25;
}
