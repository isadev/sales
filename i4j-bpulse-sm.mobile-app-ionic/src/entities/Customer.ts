import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Itinerary } from "./Itinerary";
import { CustomerContact } from "./CustomerContact";
import { Invoice } from "./Invoice";
import { Client } from "./Client";
import { City } from "./City";
import { SyncStatus } from "./SyncStatus";
import { CustomerAssign } from "./CustomerAssign";

@Entity('customer')
export class Customer {
    
    @PrimaryColumn()
    id: string;

    @Column()
    name:string;
    
    @Column()
    phone:string
    
    @Column()
    address:string;
    
    @Column()
    postal_code:number;

    @Column()
    geolocation:string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @Column()
    nit: string;

    @OneToMany(type => Itinerary, itineraries => itineraries.customer)
    itineraries: Itinerary[];

    @OneToMany(type => CustomerContact, customer_contacts => customer_contacts.customer)
    customer_contacts: CustomerContact[];

    @OneToMany(type => Invoice, invoices => invoices.customer)
    invoices: Invoice[];

    @ManyToOne(type => Client, client => client.customers, {
        onDelete : "CASCADE"
    })
    client: Client;

    @ManyToOne(type => City, city => city.customers, {
        onDelete : "CASCADE"
    })
    city: City;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;

    @OneToMany(type => CustomerAssign, customer_assign => customer_assign.customer)
    customer_assign: CustomerAssign[];
}