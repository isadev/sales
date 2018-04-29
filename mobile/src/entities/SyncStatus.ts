import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('sync_status')
export class SyncStatus {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}