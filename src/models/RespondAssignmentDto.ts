import { ScoreSectionDto } from './ScoreSectionDto';

export interface RespondAssignmentDto {
    id: string;
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