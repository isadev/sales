import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './Customer';
import { Itinerary } from './Itinerary';
import { SyncStatus } from './SyncStatus';

@Entity("customer_contact")
export class CustomerContact {
    
    @PrimaryColumn()
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    phone:string;

    @Column()
    mobile:string;

    @Column()
    job_title: string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @ManyToOne(type => Customer, customer => customer.customer_contacts, {
        onDelete : "CASCADE"
    })
    customer: Customer;

    @OneToMany(type => Itinerary, itineraries => itineraries.customer_contact)
    itineraries: Itinerary[];

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}