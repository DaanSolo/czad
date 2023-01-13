import "reflect-metadata";
import { DataSource } from "typeorm";
import { Message } from "./entity/Message"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Message],
    migrations: [],
    subscribers: [],
});
