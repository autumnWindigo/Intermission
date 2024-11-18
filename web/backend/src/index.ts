import "reflect-metadata"

import { AppDataSource } from "./data-source";

import { Test } from './entity/Test';
import { TestGroup } from "./entity/TestGroup";
import { Report } from "./entity/Report";
import { TestTimestamp } from "./entity/TestTimestamp";

const test: Test = new Test()
const timestamp: TestTimestamp = new TestTimestamp()
const group: TestGroup = new TestGroup()
const report: Report = new Report()

test.groups = [group]
test.reports = [report]
test.timestamp = timestamp
test.fileName = "fileNameTest"
test.filePath = "testFilePath"
test.testName = "testNameTest"

timestamp.lastRun = "lastrun time"
timestamp.firstAdded = "firstadd time"
timestamp.lastFailed = "lastfail time"
timestamp.lastUpdated = "lastupdate time"

group.name = "My Group Name"

report.pass = true
report.timestamp = "pretend it's a time"

AppDataSource.initialize()
    .then(async () => {
        // Do shit here
        await AppDataSource.manager.save(test)

        const savedTest = await AppDataSource.getRepository(Test).findOne({
            where: { testId: test.testId },
            relations: ['groups'], // Load related groups
        });

        console.log("Saved Test with Groups:", savedTest)
    }).catch((error: any) => console.log(error))
