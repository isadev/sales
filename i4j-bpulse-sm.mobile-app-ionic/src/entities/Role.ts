import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './User';
@Entity('role')
export class Role {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    /* @Column()
    enabled: boolean;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;

    @Column()
    date_updated: number; */

    @OneToMany(type => User, users => users.role)
    users: User[];
}