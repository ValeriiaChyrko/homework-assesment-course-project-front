export interface RequestAttemptDto {
    studentId: string;
    assignmentId: string;
    attemptNumber: number;
    branchName: string;
    compilationScore: number;
    testsScore: number;
    qualityScore: number;
}