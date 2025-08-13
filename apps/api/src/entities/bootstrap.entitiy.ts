import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: '_bootstrap' })
export class Bootstrap {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    note!: string;
}