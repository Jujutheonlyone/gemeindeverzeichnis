import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class ListMunicipalitiesDto {
    @ApiPropertyOptional({ description: 'Freitextsuche im Namen (case-insensitive)' })
    @IsOptional()
    @IsString()
    query?: string;

    @ApiPropertyOptional({ description: 'Filter auf Bundesland (ARS, 2-stellig)' })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional({ description: 'Filter auf Kreis (ARS, 5-stellig)' })
    @IsOptional()
    @IsString()
    district?: string;

    @ApiPropertyOptional({ description: 'Stichtag (YYYY-MM-DD). Liefert die zu diesem Datum gültigen Gemeinden.' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 25, minimum: 1, maximum: 200 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(200)
    limit?: number = 25;
}