import { RespondAttemptDto } from "../models/RespondAttemptDto.ts";

export const fetchTasksByAssignmentId = async (assignmentId: string): Promise<RespondAttemptDto[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts/${assignmentId}/assignment`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: RespondAttemptDto[] = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні спроб:", error);
        throw error;
    }
};

export const fetchLastAttemptByAssignmentId = async (assignmentId: string): Promise<RespondAttemptDto> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts/${assignmentId}/assignment/last`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: RespondAttemptDto = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні останньої спроби:", error);
        throw error;
    }
};