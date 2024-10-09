import GitHubRepositoryIcon from '../assets/repository-info.svg';
import GitHubBranchIcon from '../assets/branch-info.svg';
import {Box} from "@mui/material";
import {styled} from "@mui/system";
import TaskButton from "./TaskButtons.tsx";
import InfoBlock from "./InfoBlock.tsx";
import {TaskInformationText} from "../styles/TaskStyles.ts";

const TaskInformationContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: '40px',
});
const InfoSection = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: '40px'
});

function TaskSolution({ taskStatus }: { taskStatus: string }) {
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
                <TaskInformationText>
                    Рішення
                </TaskInformationText>
                <TaskInformationContainer>
                    <InfoSection>
                        <InfoBlock imgSrc={GitHubRepositoryIcon} title="Мій репозиторій" subtitle="fancy-task" />
                        <InfoBlock imgSrc={GitHubBranchIcon} title="Гілка" subtitle="master" />
                    </InfoSection>

                    <TaskButton status={taskStatus} isDisabled={false}/>
                </TaskInformationContainer>
            </Box>
        </Box>
    );
}

export default TaskSolution;
