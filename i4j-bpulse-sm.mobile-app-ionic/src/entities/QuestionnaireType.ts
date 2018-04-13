import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Questionnaire } from "./Questionnaire";

@Entity('questionnaire_type')
export class QuestionnaireType {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(type => Questionnaire, questionnaire => questionnaire.questionnaire_type)
    questionnaire: Questionnaire[];
}