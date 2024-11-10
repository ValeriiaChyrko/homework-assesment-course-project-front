import {RespondAttemptDto} from "../models/RespondAttemptDto.ts";
import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";

export interface AttemptBlockProps {
    attempt: RespondAttemptDto | null;
    task: RespondAssignmentDto | null;
}
