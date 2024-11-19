import cron from "node-cron";
import { AppDataSource } from "./data-source";
import { TestGroup } from "./entity/TestGroup";
import { runPytestForTestGroup } from "./runPytestOnTestGroup";

/*
What do we need the scheduler to do???

Init chron jobs on server start for each test group
Run job on cron schedule (duh)

Track active chron jobs for each test group
Update active chron jobs when TestGroup.schedule is updated
Delete active chron job when TestGroup is deleted
*/

// number is the TestGroup ID
// scheduled task is the associated chron job
const activeCrons: Map<number, cron.ScheduledTask> = new Map()

// Init existing chron jobs
// This should be run in root .ts file to have cron functionality
export function initializeSchedulers() {
    const testGroupRepo = AppDataSource.getRepository(TestGroup);
    testGroupRepo.find().then((testGroups) => {
        testGroups.forEach((testGroup) => {
            if (testGroup.schedule) {
                scheduleTestGroupJob(testGroup);
            }
        });
    });
}

// Schedules new chron job
// Can be used as an update function as well
export function scheduleTestGroupJob(testGroup: TestGroup) {
    // Check if the schedule is null or undefined
    if (!testGroup.schedule) {
        console.log(`Skipping cron job scheduling for TestGroup ID: ${testGroup.testGroupId} (null or undefined)`);
        return;
    }

    // Delete old cron Job
    if (activeCrons.has(testGroup.testGroupId)) {
        const existingJob = activeCrons.get(testGroup.testGroupId);
        existingJob?.stop()
        console.log(`Canceled existing cron job for TestGroupId: ${testGroup.testGroupId}`);
    }

    // Create and schedule new cron job
    // Notify of running & run tests
    const newJob = cron.schedule(testGroup.schedule!, async () => {
        console.log(`Running scheduled pytests for group: ${testGroup.name} (${testGroup.testGroupId})`);
        await runPytestForTestGroup(testGroup.testGroupId);
    });

    // Store cron job to keep track of it
    activeCrons.set(testGroup.testGroupId, newJob);
    console.log(`Scheduled new cron job for ${testGroup.testGroupId}`)
}

// for DELETE function
export function removeTestGroupJob(testGroup: TestGroup) {
    // Delete cron job
    if (activeCrons.has(testGroup.testGroupId)) {
        const existingJob = activeCrons.get(testGroup.testGroupId);
        existingJob?.stop()
        console.log(`Canceled existing cron job for TestGroupId: ${testGroup.testGroupId}`);
        return;
    }
    // Notify if no cron job existed
    console.error(`No existing cron job for TestGroupId: ${testGroup.testGroupId}`);
}
