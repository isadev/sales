import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Client } from './Client';
import { Role } from './Role';
import { Itinerary } from './Itinerary';
import { Expense } from './Expense';
import { Workday } from './Workday';
import { SyncStatus } from './SyncStatus';
import { CustomerAssign } from './CustomerAssign';
@Entity('user')
export class User {

    @PrimaryColumn()
    id: string;
    
    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    enabled: boolean;

    @Column()
    bpulse_user_token: string;
    
    @Column()
    google_push_token: string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @ManyToOne(type => Role, role => role.users, {
        onDelete : "CASCADE"
    })
    role: Role;

    @OneToMany(type => Itinerary, itineraries => itineraries.user)
    itineraries: Itinerary[];

    @OneToMany(type => Expense, expense => expense.user)
    expense: Expense[];

    @OneToMany(type => Workday, workday => workday.user)
    workday: Workday[];

    @ManyToOne(type => Client, client => client.users, {
        onDelete : "CASCADE"
    })
    client: Client;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;

    @OneToMany(type => CustomerAssign, customer_assign => customer_assign.user)
    customer_assign: CustomerAssign[];
}