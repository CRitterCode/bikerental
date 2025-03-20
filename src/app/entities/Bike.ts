import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm"
import Rental from "./Rental"

@Entity()
class Bike {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    price: number

    @Column("integer")
    inventoryCount: number

    @OneToMany(() => Rental, (rental) => rental.user)
    rentals: Rental[]
}

export default Bike;