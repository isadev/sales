import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './Client';
import { ProductCategory } from './ProductCategory';
import { Price } from './Price';
import { InvoiceProduct } from './InvoiceProduct';
import { SyncStatus } from './SyncStatus';
@Entity('product')
export class Product {

    @PrimaryColumn()
    id: string;

    @Column()
    code:string;

    @Column()
    barcode:string;

    @Column()
    name:string;

    @Column()
    custom_image:string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @ManyToOne(type => Client, client => client.product, {
        onDelete : "CASCADE"
    })
    client: Client;

    @ManyToOne(type => ProductCategory, product_category => product_category.product, {
        onDelete : "CASCADE"
    })
    product_category: ProductCategory;

    @OneToMany(type => Price, prices => prices.product)
    prices: Price[];

    @OneToMany(type => InvoiceProduct, invoice_product => invoice_product.product)
    invoice_product: InvoiceProduct[];

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}