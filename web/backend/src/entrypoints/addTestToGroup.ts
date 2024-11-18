//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Add new test to test group

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";
import { Test } from "../entity/Test";

const router = Router();
