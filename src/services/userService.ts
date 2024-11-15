import {RespondStudentDto} from "../models/RespondStudentDto.ts";

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
