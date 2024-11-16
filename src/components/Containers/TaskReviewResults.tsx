import { Box } from "@mui/material";
import { TaskInformationText } from "../../assets/styles/TextStyles.ts";
import AttemptAmountBox from "../Boxes/AttemptAmountBox.tsx";
import AttemptBlock from "./AttemptBlock.tsx";
import { TASK_RESULTS } from "../../assets/constants/texts.ts";
import {TaskReviewResultProps} from "../../types/TaskReviewResultProps.ts";
import {useEffect} from "react";

function TaskReviewResults({ task, attemptList  }: TaskReviewResultProps) {
    useEffect(() => {
        const shouldScroll = sessionStorage.getItem('scrollToBottom');
        if (shouldScroll === 'true') {
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
                sessionStorage.removeItem('scrollToBottom');
            }, 300);
        }
    }, [task, attemptList]);

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