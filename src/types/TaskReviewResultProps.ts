import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";
import {RespondAttemptDto} from "../models/RespondAttemptDto.ts";

export interface TaskReviewResultProps {
    task: RespondAssignmentDto | null;
    attemptList: RespondAttemptDto[];
}