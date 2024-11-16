import {RespondStudentDto} from "../models/RespondStudentDto.ts";
import {RespondTeacherDto} from "../models/RespondTeacherDto.ts";

export const fetchStudent = async (githubProfileId: string): Promise<RespondStudentDto> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/students/${githubProfileId}`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: RespondStudentDto = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні студента:", error);
        throw error;
    }
};

export const fetchTeacher = async (githubProfileId: string): Promise<RespondTeacherDto> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teachers/${githubProfileId}`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: RespondStudentDto = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні вчителя:", error);
        throw error;
    }
};