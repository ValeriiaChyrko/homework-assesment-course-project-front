import { Box } from "@mui/material";
import { TaskInformationText } from "../../assets/styles/TaskStyles.ts";
import AttemptAmountBox from "../Boxes/AttemptAmountBox.tsx";
import AttemptBlock from "./AttemptBlock.tsx";
import { TASK_RESULTS } from "../../assets/constants/texts.ts";
import { useEffect, useState } from "react";
import { RespondAttemptDto } from "../../models/RespondAttemptDto.ts";
import { fetchTasksByAssignmentId } from "../../services/attemptService.ts";
import {TaskReviewResultProps} from "../../types/TaskReviewResultProps.ts";

function TaskReviewResults({ task }: TaskReviewResultProps) {
    const [attemptList, setAttemptList] = useState<RespondAttemptDto[] | null>(null);

    const fetchAttemptData = async (taskId: string) => {
        try {
            const attemptData: RespondAttemptDto[] = await fetchTasksByAssignmentId(taskId);
            setAttemptList(attemptData);
        } catch (err) {
            console.error("Error fetching attempt data:", err);
        }
    };

    useEffect(() => {
        const taskId = "12a0b3e6-a106-43dd-b57f-d38ba6c62c4e";
        fetchAttemptData(taskId);
    }, []);

    return (
        <Box
            maxWidth="lg"
            sx={{
                bgcolor: '#EDF1F5',
                paddingTop: '20px',
                paddingX: '40px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
            }}
        >
            <Box
                bgcolor="#FFFFFF"
                borderRadius="10px"
                padding="40px"
            >
                <Box display="flex" justifyContent="space-between">
                    <TaskInformationText>
                        {TASK_RESULTS.title}
                    </TaskInformationText>

                    <AttemptAmountBox
                        usedAttemptAmount={attemptList ? attemptList.length : 0}
                        maxAttemptAmount={task?.maxAttemptsAmount ?? 0}
                    />
                </Box>

                {attemptList && attemptList.length > 0 ? (
                    attemptList.map(attempt => (
                        <AttemptBlock key={attempt.id} attempt={attempt} task={task} />
                    ))
                ) : (
                    <TaskInformationText>No attempts available.</TaskInformationText>
                )}
            </Box>
        </Box>
    );
}

export default TaskReviewResults;