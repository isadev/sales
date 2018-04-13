import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Itinerary } from "./Itinerary";
import { Questions } from "./Questions";
import { SyncStatus } from "./SyncStatus";

@Entity('answer')
export class Answer {

    @PrimaryColumn()
    id: string;

    @Column()
    text_data: string;

    @Column({ nullable: true })
    attached_data: string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;

    @Column()
    date_updated: number;

    @ManyToOne(type => Itinerary, itinerary => itinerary.answers, {
        onDelete: "CASCADE"
    })
    itinerary: Itinerary;

    @ManyToOne(type => Questions, questions => questions.answer, {
        onDelete: "CASCADE"
    })
    questions: Questions;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}