export interface RequestAttemptDto {
    studentId: string;
    assignmentId: string;
    attemptNumber: number;
    compilationScore: number;
    testsScore: number;
    qualityScore: number;
}