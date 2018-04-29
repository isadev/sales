import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Itinerary } from './Itinerary';
import { User } from './User';
import { SyncStatus } from './SyncStatus';
@Entity('expense')
export class Expense {
    
    @PrimaryColumn()
    id: string;

    @Column()
    item: string;

    @Column()
    value: number;

    @Column()
    description: string;

    @Column()
    atteched: string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;

    @ManyToOne(type => Itinerary, itinerary => itinerary.expense, {
        onDelete : "CASCADE"
    })
    itinerary: Itinerary;

    @ManyToOne(type => User, user => user.expense, {
        onDelete : "CASCADE"
    })
    user: User;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}