import {Entity, PrimaryColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class Cases extends BaseEntity {

    @PrimaryColumn()
    date: string;

    @Column()
    cases: number;

    @Column()
    deaths: number;

    @Column()
    country: string;

    @PrimaryColumn()
    geo_id: string;
}