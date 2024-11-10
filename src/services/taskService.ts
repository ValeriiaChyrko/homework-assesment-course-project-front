import { RespondAssignmentDto } from '../models/RespondAssignmentDto';

export const fetchTask = async (taskId: string): Promise<RespondAssignmentDto> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/${taskId}`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: RespondAssignmentDto = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні завдання:", error);
        throw error;
    }
};
