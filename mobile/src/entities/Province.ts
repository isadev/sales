import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Country } from './Country';
import { City } from './City';
@Entity('province')
export class Province {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(type => Country, country => country.provinces, {
        onDelete: "CASCADE"
    })
    country: Country;

    @OneToMany(type => City, city => city.province)
    city: City[];
}