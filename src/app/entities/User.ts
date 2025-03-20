import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm"
import Rental from "./Rental"

enum UserRole {
    CUSTOMER = "customer",
    EMPLOYEE = "employee",
    ADMIN = "admin"
}

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column({
        type: "simple-enum",
        enum: UserRole,
        default: UserRole.CUSTOMER
    })
    role: UserRole
    
    @OneToMany(() => Rental, (rental) => rental.user)
    rentals: Rental[]
}

export default User;
export { UserRole };