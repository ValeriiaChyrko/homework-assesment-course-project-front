import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";
import {RequestAttemptDto} from "../models/RequestAttemptDto.ts";

export interface TaskSolutionProps {
    task: RespondAssignmentDto | null;
    attempt: RequestAttemptDto | null;
    githubProfileId: string | null;
}