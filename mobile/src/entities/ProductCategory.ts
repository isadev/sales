import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Client } from './Client';
import { Product } from './Product';
import { SyncStatus } from './SyncStatus';
@Entity('product_category')
export class ProductCategory {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;
    
    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @OneToMany(type => Product, product => product.product_category)
    product: Product[];

    @ManyToOne(type => Client, client => client.product_category, {
        onDelete: "CASCADE"
    })
    client: Client;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}