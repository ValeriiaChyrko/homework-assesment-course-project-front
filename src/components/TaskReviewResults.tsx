import {Box} from "@mui/material";
import {TaskInformationText} from "../styles/TaskStyles.ts";
import AttemptAmountBox from "./AttemptAmountBox.tsx";
import AttemptBlock from "./AttemptBlock.tsx";
import {Attempt} from "../models/Attempt.ts";

function TaskReviewResults() {
    const attempt = new Attempt(
        1, // Номер спроби
        5, // Бал за компіляцію
        65, // Бал за тести
        30, // Бал за якість
        100, // Максимальний бал
        0 // Мінімальний бал
    );

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
                        Результати перевірки
                    </TaskInformationText>

                    <AttemptAmountBox usedAttemptAmount={1} maxAttemptAmount={10} />
                </Box>

                <AttemptBlock attempt={attempt}/>
            </Box>
        </Box>
    );
}

export default TaskReviewResults;
