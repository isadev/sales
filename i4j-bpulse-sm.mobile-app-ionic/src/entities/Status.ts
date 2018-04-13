import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Itinerary } from './Itinerary';
@Entity('status')
export class Status {
    
    @PrimaryColumn()
    id: string;
    
    @Column()
    name: string;

    @OneToMany(type => Itinerary, itineraries => itineraries.status)
    itineraries: Itinerary[];
}