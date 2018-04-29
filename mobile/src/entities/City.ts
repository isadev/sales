import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';
import { Itinerary } from './Itinerary';
import { Invoice } from './Invoice';
import { Customer } from './Customer';
import { Province } from './Province';
import { Client } from './Client';
@Entity('city')
export class City {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(type => Itinerary, itineraries => itineraries.city)
    itineraries: Itinerary[];

    @OneToMany(type => Invoice, invoices => invoices.city)
    invoices: Invoice[];
    
    @OneToMany(type => Customer, customers => customers.city)
    customers: Customer[];

    @ManyToOne(type => Province, province => province.city, {
        onDelete : "CASCADE"
    })
    province: Province;

    @OneToMany(type => Client, client => client.city)
    client: Client[];

}