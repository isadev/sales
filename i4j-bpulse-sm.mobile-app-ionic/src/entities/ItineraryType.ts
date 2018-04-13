import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Questionnaire } from "./Questionnaire";
import { Itinerary } from "./Itinerary";

@Entity('itinerary_type')
export class ItineraryType {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    with_email_to_contact: string;

    @OneToMany(type => Questionnaire, questionnaires => questionnaires.itinerary_type)
    questionnaires: Questionnaire[];

    @OneToMany(type => Itinerary, itineraries => itineraries.itinerary_type)
    itineraries: Itinerary[];
}