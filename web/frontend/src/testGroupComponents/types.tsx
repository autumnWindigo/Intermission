//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** VVV
// Tests for use in TestGroupTile
// They're the same as in the DB without these typescript might get feisty
// Gotta make the compiler happy :3

export interface Test {
    testId: number;
    testName: string;
    filePath: string | null;
    timestamp: {
        firstAdded: Date;
        lastRun: string | null;
    };
}

export interface TestResult {
    resultId: number;
    output: string;
    passedSubtests: number;
    failedSubtests: number;
    overallSuccess: boolean;
    createdAt: Date;
}

export interface TestGroup {
    testGroupId: number;
    name: string;
    schedule: string | null;
    tests: Test[]
    results: TestResult[];
}
