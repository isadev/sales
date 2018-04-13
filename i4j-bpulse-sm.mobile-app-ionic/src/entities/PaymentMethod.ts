import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';
import { Client } from './Client';
import { Invoice } from './Invoice';
import { SyncStatus } from './SyncStatus';

@Entity("payment_method")
export class PaymentMethod {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    /* @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;

    @Column()
    date_updated: number; */

    @OneToMany(type => Invoice, invoices => invoices.payment_method)
    invoices: Invoice[];

    @ManyToOne(type => Client, client => client.payment_method, {
        onDelete : "CASCADE"
    })
    client: Client;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}