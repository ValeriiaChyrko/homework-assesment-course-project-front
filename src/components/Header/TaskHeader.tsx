import { Box } from '@mui/material';
import StatusBox from "../Boxes/TaskStatusBox.tsx";
import TaskButton from "../Buttons/TaskButtons.tsx";
import { TaskInformationText } from "../../assets/styles/TextStyles.ts";

function TaskHeader({ taskName, score, taskStatus, isClosed }: { taskName: string, score: number, taskStatus: string, isClosed: boolean }) {

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
                    <TaskInformationText>{taskName}</TaskInformationText>
                    {taskStatus === 'finished' && (
                        <StatusBox value={score} />
                    )}
                </Box>

                <TaskButton status={taskStatus} isDisabled={isClosed} />
            </Box>
        </Box>
    );
}

export default TaskHeader;
