import {Box} from '@mui/material';
import StatusBox from "./TaskStatusBox.tsx";
import TaskButton from "./TaskButtons.tsx";
import {TaskInformationText} from "../styles/TaskStyles.ts";

function TaskHeader({ taskStatus }: { taskStatus: string }) {
    const score = 100;

    return (
        <Box
            maxWidth="lg"
            sx={{
                bgcolor: '#EDF1F5',
                paddingTop: '40px',
                paddingX: '40px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#FFFFFF"
                borderRadius="10px"
                paddingY="20px"
                paddingX="40px"
            >
                <Box display="flex" alignItems="center">
                    <TaskInformationText>Практичне завдання № 1</TaskInformationText>
                    {taskStatus === 'finished' && (
                        <StatusBox value={score} />
                    )}
                </Box>

                <TaskButton status={taskStatus} isDisabled={false} />
            </Box>
        </Box>
);
}

export default TaskHeader;
