//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Data source for mariadb

import "reflect-metadata";
import "dotenv/config";

import { DataSource } from "typeorm";
import { Test } from "./entity/Test";
import { TestGroup } from "./entity/TestGroup";
import { TestTimestamp } from "./entity/TestTimestamp";
import { TestResult } from "./entity/TestResult";

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: 3307,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    entities: [Test, TestGroup, TestTimestamp, TestResult],
    subscribers: [],
    migrations: [],
    synchronize: true,
    logging: true
})
