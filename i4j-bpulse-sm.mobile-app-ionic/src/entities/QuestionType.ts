import {Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Questions } from "./Questions";

@Entity('question_type')
export class QuestionType {
    
    @PrimaryColumn()
    id: string;
    
    @Column()
    name: string; 
    
    @OneToMany(type => Questions, questions => questions.question_type)
    questions: Questions[];
}