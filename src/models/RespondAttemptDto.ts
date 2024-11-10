export interface RespondAttemptDto {
    id: string;
    studentId: string;
    assignmentId: string;
    finishedAt: Date;
    attemptNumber: number;
    compilationScore: number;
    testsScore: number;
    qualityScore: number;
    finalScore: number;
}
