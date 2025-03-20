import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import User from "./User"
import Invoice from "./Invoice"
import Bike from "./Bike"

@Entity()
class Rental {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.rentals)
    user: User

    @ManyToOne(() => Bike, (bike) => bike.rentals)
    bike: Bike

    @OneToOne(() => Invoice, (invoice) => invoice.rental)
    invoice: Invoice

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @Column({ nullable: true })
    pickupDate: Date

    @Column({ nullable: true })
    returnDate: Date

    @Column()
    price: number
}

export default Rental;