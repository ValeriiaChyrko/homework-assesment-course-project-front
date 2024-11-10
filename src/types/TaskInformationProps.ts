import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";
import {RespondAttemptDto} from "../models/RespondAttemptDto.ts";

export interface TaskInformationProps {
    task: RespondAssignmentDto | null;
    taskStatus: string;
    lastAttempt: RespondAttemptDto | null;
}