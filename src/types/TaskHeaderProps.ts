import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";
import {RespondTeacherDto} from "../models/RespondTeacherDto.ts";

export interface TaskHeaderProps {
    task: RespondAssignmentDto,
    teacher: RespondTeacherDto,
    score: number,
    taskStatus: string,
    isClosed: boolean
};