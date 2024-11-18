//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Main Server for backend

import "reflect-metadata"

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { AppDataSource } from "./data-source";
import testController from "./controllers/TestController";
import testPost from "./entrypoints/TestPost";
import testPut from "./entrypoints/TestPut";
import testDelete from "./entrypoints/TestDelete";

const app = express();
const PORT = 8000;

// API nessecities
app.use(cors());
app.use(bodyParser.json());

// Connect to DB
AppDataSource.initialize()
    .then(async () => {
        console.log("DB Innitialized")
    }).catch((error: any) => console.log("Error during DS init:", error));

// Insert routers for Tests
app.use("/api", testController); // GET
app.use("/api", testPost);
app.use("/api", testPut);
app.use("/api", testDelete);

// Run Server
app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});

// ============================
// Ignore below
// ============================

// Make an example test if we need

// import { Test } from './entity/Test';
// import { TestGroup } from "./entity/TestGroup";
// import { Report } from "./entity/Report";
// import { TestTimestamp } from "./entity/TestTimestamp";

// const test: Test = new Test()
// const timestamp: TestTimestamp = new TestTimestamp()
// const group: TestGroup = new TestGroup()
// const report: Report = new Report()
//
// test.groups = [group]
// test.reports = [report]
// test.timestamp = timestamp
// test.fileName = "fileNameTest"
// test.filePath = "testFilePath"
// test.testName = "testNameTest"
//
// timestamp.lastRun = "lastrun time"
// timestamp.firstAdded = "firstadd time"
// timestamp.lastFailed = "lastfail time"
// timestamp.lastUpdated = "lastupdate time"
//
// group.name = "My Group Name"
//
// report.pass = true
// report.timestamp = "pretend it's a time"
