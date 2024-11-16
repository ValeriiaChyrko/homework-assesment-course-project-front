import {RequestAttemptDto} from "../models/RequestAttemptDto.ts";
import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";
import {RespondTeacherDto} from "../models/RespondTeacherDto.ts";

export interface TaskButtonProps {
    status: string;
    isDisabled?: boolean;
    attempt?: RequestAttemptDto | null;
    task?: RespondAssignmentDto | null;
    owner?: RespondTeacherDto | null;
}