import "reflect-metadata";
import { DataSource } from "typeorm";
import { Message } from "./entity/Message"
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.DATABASE_PATH,
    synchronize: true,
    logging: false,
    entities: [Message, User],
    migrations: [],
    subscribers: [],
});
