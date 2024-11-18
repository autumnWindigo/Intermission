import "reflect-metadata";
import "dotenv/config";

import { DataSource } from "typeorm";
import { Report } from "./entity/Report";
import { Test } from "./entity/Test";
import { TestGroup } from "./entity/TestGroup";
import { TestTimestamp } from "./entity/TestTimestamp";

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    entities: [Test, TestGroup, TestTimestamp, Report],
    subscribers: [],
    migrations: [],
    synchronize: true,
    logging: true
})
