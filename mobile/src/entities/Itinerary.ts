import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ItineraryType } from "./ItineraryType";
import { Customer } from "./Customer";
import { City } from "./City";
import { Client } from "./Client";
import { User } from "./User";
import { Status } from "./Status";
import { Answer } from "./Answer";
import { Expense } from "./Expense";
import { Invoice } from "./Invoice";
import { CustomerContact } from "./CustomerContact";
import { SyncStatus } from "./SyncStatus";

@Entity('itinerary')
export class Itinerary {

    @PrimaryColumn()
    id: string;

    @Column()
    address: string;

    @Column()
    date_time: number

    @Column()
    geolocation: string;

    @Column()
    last_itinerary_position: number;

    @Column({ default: "" })
    observation: string;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;

    @Column()
    date_updated: number;

    @ManyToOne(type => ItineraryType, itinerary_type => itinerary_type.itineraries, {
        onDelete: "CASCADE"
    })
    itinerary_type: ItineraryType;

    @ManyToOne(type => Customer, customer => customer.itineraries, {
        onDelete: "CASCADE"
    })
    customer: Customer;

    @ManyToOne(type => CustomerContact, customer_contact => customer_contact.itineraries, {
        onDelete: "CASCADE"
    })
    customer_contact: CustomerContact;

    @ManyToOne(type => City, city => city.itineraries, {
        onDelete: "CASCADE"
    })
    city: City;

    @ManyToOne(type => Client, client => client.itineraries, {
        onDelete: "CASCADE"
    })
    client: Client;

    @ManyToOne(type => User, user => user.itineraries, {
        onDelete: "CASCADE"
    })
    user: User;

    @ManyToOne(type => Status, status => status.itineraries, {
        onDelete: "CASCADE"
    })
    status: Status;

    @OneToMany(type => Answer, answer => answer.itinerary)
    answers: Answer[];

    @OneToMany(type => Expense, expense => expense.itinerary)
    expense: Expense[];

    @OneToOne(type => Invoice, invoice => invoice.itinerary, {
    })
    invoice: Invoice;

    getGeolocation() {
        let geolocation: any = this.geolocation;

        return geolocation.split(",");
    }

    @ManyToOne(type => SyncStatus, {
        onDelete: "SET NULL"
    })
    sync_status: SyncStatus;
}