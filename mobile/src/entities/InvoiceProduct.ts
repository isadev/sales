import { Entity, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Invoice } from "./Invoice";
import { SyncStatus } from "./SyncStatus";

@Entity('invoice_product')
export class InvoiceProduct {
    @Column()
    discount: number;

    @Column("float")
    order_price: number;

    @Column()
    quantity: number;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @ManyToOne(type => Invoice, invoices => invoices.invoice_product, {
        onDelete : "CASCADE",
        primary:true
    })
    invoices: Invoice;

    @ManyToOne(type => Product, product => product.invoice_product,{
        primary:true
    })
    product: Product;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}