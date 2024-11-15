export const fetchBranches = async (taskId: string | null, githubProfileId: string | null): Promise<string[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/github/${githubProfileId}/${taskId}`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: string[] = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні завдання:", error);
        throw error;
    }
};

export const fetchProjectCompilationVerification = async (githubProfileId: string | null, taskId: string | null, branch: string): Promise<number> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/github/compilation/${githubProfileId}/${taskId}/${branch}`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: number = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні балів за компіляцію проєктів репозиторію.:", error);
        throw error;
    }
};

export const fetchProjectQualityVerification = async (githubProfileId: string | null, taskId: string | null, branch: string): Promise<number> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/github/quality/${githubProfileId}/${taskId}/${branch}`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: number = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні балів за якість коду проєктів репозиторію.:", error);
        throw error;
    }
};

export const fetchProjectTestsVerification = async (githubProfileId: string | null, taskId: string | null, branch: string): Promise<number> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/github/tests/${githubProfileId}/${taskId}/${branch}`);
        if (!response.ok) {
            throw new Error('Помилка при отриманні даних');
        }
        const data: number = await response.json();
        return data;
    } catch (error) {
        console.error("Помилка при отриманні балів за виконання тестів проєктів репозиторію.:", error);
        throw error;
    }
};