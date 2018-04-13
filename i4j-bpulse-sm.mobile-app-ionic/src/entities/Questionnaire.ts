import {Entity, PrimaryColumn, Column, OneToMany, ManyToOne} from "typeorm";
import {Questions} from "./Questions";
import { ItineraryType } from "./ItineraryType";
import { Client } from "./Client";
import { QuestionnaireType } from "./QuestionnaireType";
import { SyncStatus } from "./SyncStatus";

@Entity('questionnaire')
export class Questionnaire {
    
    @PrimaryColumn()
    id: string;
    
    @Column()
    label: string;
    
    @Column()
    enabled: boolean;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;
    
    @OneToMany(type => Questions, questions => questions.questionnaire)
    questions: Questions[];

    @ManyToOne(type => ItineraryType, itinerary_type => itinerary_type.questionnaires, {
        onDelete : "CASCADE"
    })
    itinerary_type: ItineraryType;

    @ManyToOne(type => Client, client => client.questionnaires, {
        onDelete : "CASCADE"
    })
    client: Client;
    
    @ManyToOne(type => QuestionnaireType, questionnaire_type => questionnaire_type.questionnaire, {
    })
    questionnaire_type: QuestionnaireType;

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}