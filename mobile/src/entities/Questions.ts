import {Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import {Questionnaire} from "./Questionnaire";
import { QuestionType } from "./QuestionType";
import { Answer } from "./Answer";
import { SyncStatus } from "./SyncStatus";

@Entity('questions')
export class Questions {
    
    @PrimaryColumn()
    id: string;
    
    @Column()
    label: string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number;
        
    @ManyToOne(type => Questionnaire, questionnaire => questionnaire.questions, {
        onDelete : "CASCADE"
    })
    questionnaire: Questionnaire;

    @ManyToOne(type => QuestionType, question_type => question_type.questions, {
        onDelete : "CASCADE"
    })
    question_type: QuestionType;
    
    @OneToMany(type => Answer, answer => answer.questions)
    answer: Answer[];

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}