import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdDate: Date

    @ManyToOne(() => User)
    user: User

    @Column()
    content: string

}
