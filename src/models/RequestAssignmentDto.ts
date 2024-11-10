import { ScoreSectionDto } from "./ScoreSectionDto";

export interface RequestAssignmentDto {
    ownerId: string;
    title: string;
    description?: string;
    deadline: Date;
    maxScore: number;
    maxAttemptsAmount: number;
    compilationSection?: ScoreSectionDto;
    testsSection?: ScoreSectionDto;
    qualitySection?: ScoreSectionDto;
}
