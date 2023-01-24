import "reflect-metadata";
import { DataSource } from "typeorm";
import { Message } from "./entity/Message"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.DATABASE_PATH,
    synchronize: true,
    logging: false,
    entities: [Message],
    migrations: [],
    subscribers: [],
});
