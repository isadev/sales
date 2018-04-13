import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { City } from './City';
import { User } from './User';
import { Itinerary } from './Itinerary';
import { Questionnaire } from './Questionnaire';
import { Product } from './Product';
import { ProductCategory } from './ProductCategory';
import { Invoice } from './Invoice';
import { PaymentMethod } from './PaymentMethod';
import { Customer } from './Customer';
@Entity('client')
export class Client {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    /* @Column()
    code: string;

    @Column()
    custom_image: string;

    @Column()
    enabled: boolean;

    @Column()
    user_created: string;

    @Column()
    user_updated: string;

    @Column()
    date_created: number;
    
    @Column()
    date_updated: number; */

    @ManyToOne(type => City, city => city.client, {
        onDelete: "SET NULL"
    })
    city: City;

    @OneToMany(type => Itinerary, itineraries => itineraries.client)
    itineraries: Itinerary[];

    @OneToMany(type => Questionnaire, questionnaires => questionnaires.client)
    questionnaires: Questionnaire[];

    @OneToMany(type => Product, product => product.client)
    product: Product[];

    @OneToMany(type => ProductCategory, product_category => product_category.client)
    product_category: ProductCategory[];

    @OneToMany(type => Invoice, invoices => invoices.client)
    invoices: Invoice[];

    @OneToMany(type => PaymentMethod, payment_method => payment_method.client)
    payment_method: PaymentMethod[];

    @OneToMany(type => Customer, customers => customers.client)
    customers: Customer[];

    @OneToMany(type => User, users => users.client)
    users: User[];
}