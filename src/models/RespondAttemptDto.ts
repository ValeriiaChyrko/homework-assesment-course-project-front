export interface RespondAttemptDto {
    id: string;
    studentId: string;
    assignmentId: string;
    finishedAt: Date;
    attemptNumber: number;
    branchName: string;
    compilationScore: number;
    testsScore: number;
    qualityScore: number;
    finalScore: number;
}
