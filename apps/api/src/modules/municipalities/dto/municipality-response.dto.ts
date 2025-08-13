import { ApiProperty } from '@nestjs/swagger';

export class MunicipalityResponseDto {
    @ApiProperty({ example: '11000000' })
    ags!: string;
    @ApiProperty({ example: 'Berlin' })
    name!: string;
    @ApiProperty({ example: '11000' })
    districtArs!: string;
    @ApiProperty({ example: '11' })
    stateArs!: string;
    @ApiProperty({ example: '2025-05-31' })
    validFrom!: string;
    @ApiProperty({ example: null })
    validTo!: string | null;
    @ApiProperty({ example: 3769000, nullable: true })
    population!: number | null;
    @ApiProperty({ example: '891.85', nullable: true })
    areaKm2!: string | null;
    @ApiProperty({ example: 'Land Berlin', nullable: true })
    officialName!: string | null;
    @ApiProperty({ example: 'aktuell', nullable: true })
    status!: string | null;
}
