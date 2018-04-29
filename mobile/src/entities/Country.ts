import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Province } from './Province';
@Entity('country')
export class Country {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(type => Province, provinces => provinces.country)
    provinces: Province[];

}