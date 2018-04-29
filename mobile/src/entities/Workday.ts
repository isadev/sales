import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { SyncStatus } from './SyncStatus';
@Entity('workday')
export class Workday {

    @PrimaryColumn()
    id: string;

    @Column()
    item_type: string;

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

    @ManyToOne(type => User, user => user.workday, {
        onDelete: "CASCADE"
    })
    user: User;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}