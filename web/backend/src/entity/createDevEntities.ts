//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Create example entities in DB

import { env } from "process";
import { AppDataSource } from "../data-source";
import { Test } from "./Test";
import { TestGroup } from "./TestGroup";
import { TestResult } from "./TestResult";
import { TestTimestamp } from "./TestTimestamp";

export async function createDevEntities() {
    // TestGroup 1 Junk -- Weekly
    const testGroup1 = new TestGroup();
    testGroup1.name = "Weekly Tests";
    testGroup1.schedule = "0 0 * * 0"; // Every Sunday at midnight
    testGroup1.tests = [];
    testGroup1.results = [];
    await AppDataSource.manager.save(testGroup1);

    const test1 = new Test();
    test1.fileName = "unit_tests.py";
    test1.testName = "bundle_test_basic_auth";
    test1.filePath = `${process.env.TEST_DIR}/unit_tests/unit_tests.py`;
    test1.groups = [];

    const timestamp1 = new TestTimestamp();
    timestamp1.firstAdded = new Date();
    timestamp1.lastRun = null;
    timestamp1.test = test1;
    test1.timestamp = timestamp1;
    await AppDataSource.manager.save(test1);

    // TestGroup 2 Junk -- Daily
    const testGroup2 = new TestGroup();
    testGroup2.name = "Daily Tests";
    testGroup2.schedule = "0 9 * * *"; // Every day at 9 AM
    testGroup2.tests = [];
    testGroup2.results = [];

    const test2 = new Test();
    test2.fileName = "unit_tests.py";
    test2.testName = "bundle_test_concurrency";
    test2.filePath = `${process.env.TEST_DIR}/unit_tests/unit_tests.py`;
    test2.groups = [testGroup2];
    await AppDataSource.manager.save(test2);
    testGroup2.tests.push(test2);

    const result1 = new TestResult();
    result1.output = "TestCase2 output log...";
    result1.passedSubtests = 10;
    result1.failedSubtests = 0;
    result1.overallSuccess = true;
    result1.testGroup = testGroup2;
    testGroup2.results.push(result1);
    await AppDataSource.manager.save(testGroup2);

    // Test group 3 junk -- Only on run
    const testGroup3 = new TestGroup();
    testGroup3.name = "Regression Tests";
    testGroup3.schedule = null; // No schedule
    testGroup3.tests = [];
    testGroup3.results = [];

    const test3 = new Test();
    test3.fileName = "example_tests.py";
    test3.testName = "bundle_test_my_float";
    test3.filePath = `${process.env.TEST_DIR}/example_tests/example_tests.py`;
    test3.groups = [testGroup3];
    await AppDataSource.manager.save(test3);
    testGroup3.tests.push(test3);

    const test4 = new Test();
    test4.fileName = "example_tests.py";
    test4.testName = "bundle_test_my_string";
    test4.filePath = `${process.env.TEST_DIR}/example_tests/example_tests.py`;
    test4.groups = [testGroup3];
    await AppDataSource.manager.save(test4);
    testGroup3.tests.push(test4);
    await AppDataSource.manager.save(testGroup3);


    console.log("All entities saved successfully!");
}
