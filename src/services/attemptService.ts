import { RespondAttemptDto } from "../models/RespondAttemptDto.ts";
import {RequestAttemptDto} from "../models/RequestAttemptDto.ts";

export const fetchTasksByStudent = async (assignmentId: string, studentId: string): Promise<RespondAttemptDto[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts/${assignmentId}/${studentId}/student`);
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

export const createRequestAttempt = async (request: RequestAttemptDto): Promise<RespondAttemptDto> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Resource not found');
            } else if (response.status === 400) {
                throw new Error('Bad request');
            } else if (response.status === 500) {
                throw new Error('Internal server error');
            }
            throw new Error('An error occurred while creating the request attempt');
        }

        const result: RespondAttemptDto = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating request attempt:', error);
        throw error;
    }
};