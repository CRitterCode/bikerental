import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import Rental from "./Rental"

@Entity()
class Invoice {
    @PrimaryGeneratedColumn()
    id: number

    @JoinColumn()
    @OneToOne(() => Rental, (rental) => rental.invoice, { nullable: true })
    rental: Rental

    @Column()
    date: Date

    @Column({ nullable: true })
    paymentDate: Date
}

export default Invoice;