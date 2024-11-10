import GitHubRepositoryIcon from '../../assets/images/repository-info.svg';
import GitHubBranchIcon from '../../assets/images/branch-info.svg';
import {Box} from "@mui/material";
import TaskButton from "../Buttons/TaskButtons.tsx";
import InfoBlock from "./InfoBlock.tsx";
import {TaskInformationText} from "../../assets/styles/TaskStyles.ts";
import {InfoSection, TaskInformationContainer} from "../../assets/styles/SectionStyles.ts";
import {TASK_SOLUTION} from "../../assets/constants/texts.ts";

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
                    {TASK_SOLUTION.title}
                </TaskInformationText>
                <TaskInformationContainer>
                    <InfoSection>
                        <InfoBlock imgSrc={GitHubRepositoryIcon} title={TASK_SOLUTION.githubRepoLabel} subtitle="fancy-task" />
                        <InfoBlock imgSrc={GitHubBranchIcon} title={TASK_SOLUTION.githubBranchLabel} subtitle="master" />
                    </InfoSection>

                    <TaskButton status={taskStatus} isDisabled={false}/>
                </TaskInformationContainer>
            </Box>
        </Box>
    );
}

export default TaskSolution;
