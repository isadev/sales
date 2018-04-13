import {Entity, PrimaryColumn, Column, ManyToOne} from "typeorm";
import { Customer } from "./Customer";
import { User } from "./User";
import { SyncStatus } from "./SyncStatus";

@Entity('customer_assign')
export class CustomerAssign {
    
    @PrimaryColumn()
    id: string;
    
    @Column()
    status: string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;
    
    @ManyToOne(type => Customer, customer => customer.customer_assign, {
        onDelete : "CASCADE"
    })
    customer: Customer;

    @ManyToOne(type => User, user => user.customer_assign, {
        onDelete: "CASCADE"
    })
    user: User;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}