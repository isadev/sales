import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './Product';
import { SyncStatus } from './SyncStatus';
@Entity('price')
export class Price {

    @PrimaryColumn()
    id: string;

    @Column("float")
    value: number;

    @Column()
    start_date: number;

    @Column()
    end_date: number;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @ManyToOne(type => Product, product => product.prices, {
        onDelete: "CASCADE"
    })
    product: Product;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}