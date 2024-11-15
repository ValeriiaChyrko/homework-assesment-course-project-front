import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";
import {RespondAttemptDto} from "../models/RespondAttemptDto.ts";
import {RespondStudentDto} from "../models/RespondStudentDto.ts";

export interface TaskInformationProps {
    task: RespondAssignmentDto | null;
    student: RespondStudentDto | null;
    taskStatus: string;
    lastAttempt: RespondAttemptDto | null;
}