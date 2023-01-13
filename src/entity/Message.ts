import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdDate: Date

    @Column()
    username: string

    @Column()
    content: string

}
