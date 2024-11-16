import { Box } from '@mui/material';
import StatusBox from "../Boxes/TaskStatusBox.tsx";
import TaskButton from "../Buttons/TaskButtons.tsx";
import { TaskInformationText } from "../../assets/styles/TextStyles.ts";
import {TaskHeaderProps} from "../../types/TaskHeaderProps.ts";

function TaskHeader({ task, score, taskStatus, isClosed, teacher }: TaskHeaderProps) {

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
                    <TaskInformationText>{task.title}</TaskInformationText>
                    {taskStatus === 'finished' && (
                        <StatusBox value={score} />
                    )}
                </Box>

                <TaskButton status={taskStatus} isDisabled={isClosed} task={task} owner={teacher}/>
            </Box>
        </Box>
    );
}

export default TaskHeader;
