import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { City } from './City';
import { Client } from './Client';
import { Customer } from './Customer';
import { Itinerary } from './Itinerary';
import { PaymentMethod } from './PaymentMethod';
import { InvoiceProduct } from './InvoiceProduct';
import { SyncStatus } from './SyncStatus';
@Entity('invoice')
export class Invoice {

    @PrimaryColumn()
    id: string;

    @Column()
    code:string;

    @Column()
    discount:number;

    @Column()
    order_date_time:number;

    @Column()
    delivery_date_time:number;

    @Column()
    delivery_address:string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @ManyToOne(type => Client, client => client.invoices, {
        onDelete : "CASCADE"
    })
    client: Client;

    @ManyToOne(type => PaymentMethod, payment_method => payment_method.invoices, {
        onDelete : "CASCADE"
    })
    payment_method: PaymentMethod;

    @ManyToOne(type => Customer, customer => customer.invoices, {
        onDelete : "CASCADE"
    })
    customer: Customer;

    @OneToOne(type => Itinerary, itinerary => itinerary.invoice, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    itinerary: Itinerary;

    @OneToMany(type => InvoiceProduct, invoice_product => invoice_product.invoices)
    invoice_product: InvoiceProduct[];

    @ManyToOne(type => City, city => city.invoices, {
        onDelete : "CASCADE"
    })
    city: City;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}