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

import runGroupTests from "./entrypoints/runGroupTests";
import runSingleTest from "./entrypoints/runSingleTest";

//import { createDevEntities } from "./entity/createDevEntities";

const app = express();
const PORT = 8000;

// API nessecities
app.use(cors());
app.use(bodyParser.json());

// Connect to DB
AppDataSource.initialize()
    .then(async () => {
        console.log("DB Innitialized")
        //await createDevEntities();
    }).catch((error: any) => console.log("Error during DS init:", error));

// Insert routers for Tests
app.use("/api/test", testController); // GET (/test:/id?)
app.use("/api/test", testPost); // POST (/test)
app.use("/api/test", testPut); // PUT (/test/:id)
app.use("/api/test", testDelete); // DELETE (/test/:id)
app.use("/api/test", runSingleTest);


// Insert routers for Test Groups
app.use("/api/test-group", testGroupController); // GET (/test-group/:id?)
app.use("/api/test-group", addTestTogroup); // POST (/test-group/:id/add-tests)
app.use("/api/test-group", testGroupPost); // POST (/test-group)
app.use("/api/test-group", testGroupPut); // PUT (/test-group/:id)
app.use("/api/test-group", runGroupTests); // Post (/:id/run-tests)

// I need to rewrite remove tests from group

// Run Server
app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
