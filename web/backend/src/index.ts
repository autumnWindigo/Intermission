//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Main Server for backend

import "reflect-metadata"

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { AppDataSource } from "./data-source";

import testController from "./controllers/testController";
import testPost from "./entrypoints/testPost";
import testPut from "./entrypoints/testPut";
import testDelete from "./entrypoints/testDelete";

import testGroupController from "./controllers/testGroupController";
import addTestTogroup from "./entrypoints/addTestToGroup";
import testGroupPost from "./entrypoints/testGroupPost";
import testGroupPut from "./entrypoints/testGroupPut";

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
app.use("/api", testController); // GET (/test:/id)
app.use("/api", testPost); // POST (/test)
app.use("/api", testPut); // PUT (/test/:id)
app.use("/api", testDelete); // DELETE (/test/:id)

// Insert routers for Test Groups
app.use("/api", testGroupController); // GET (/test-group/:id?)
app.use("/api", addTestTogroup); // POST (/test-group/:testGroupId/tests/:testId)
app.use("/api", testGroupPost); // POST (/test-group)
app.use("/api", testGroupPut); // PUT (/test-group/:id)

// Run Server
app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
