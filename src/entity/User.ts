import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdDate: Date

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({unique: true})
    email: string

}
