import GitHubIcon from '../../assets/images/git-hub-icon.svg';
import DateTimeIcon from '../../assets/images/date-time-icon.svg';
import FinalScoreIcon from '../../assets/images/final-score-icon.svg';
import { Box } from "@mui/material";
import InfoBlock from "./InfoBlock.tsx";
import { TaskDescriptionText, TaskInformationText } from "../../assets/styles/TaskStyles.ts";
import { formatDate } from "../../assets/styles/DateAndTimeStyles.ts";
import { TASK_DESCRIPTION } from "../../assets/constants/texts.ts";
import { InfoSection, TaskInformationContainer } from "../../assets/styles/SectionStyles.ts";
import { TaskInformationProps } from "../../types/TaskInformationProps.ts";

function TaskInformation({ task, taskStatus, lastAttempt }: TaskInformationProps) {
    if (!task) {
        return <Box>No task information available.</Box>;
    }

    const score =lastAttempt ? String(lastAttempt.finalScore) : String(task.maxScore);
    const formattedDeadline = lastAttempt ? formatDate(new Date(lastAttempt.finishedAt)) : formatDate(new Date(task.deadline));
    const renderDescription = (description: string | undefined) => {
        if (description) {
            return description.split('\n').map((line, index) => (
                <span key={index}>
                    {line}
                    <br />
                </span>
            ));
        }
    };

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
                alignItems="center"
                bgcolor="#FFFFFF"
                borderRadius="10px"
                padding="40px"
            >
                <TaskInformationText>
                    {TASK_DESCRIPTION.title}
                </TaskInformationText>

                <TaskInformationContainer>
                    <InfoSection>
                        <InfoBlock imgSrc={GitHubIcon} title={TASK_DESCRIPTION.githubLink} subtitle="ValeriiaChyrko" />
                        <InfoBlock
                            imgSrc={DateTimeIcon}
                            title={taskStatus === 'finished' ? TASK_DESCRIPTION.finishedDateLabel : TASK_DESCRIPTION.deadlineLabel}
                            subtitle={formattedDeadline}
                        />
                        <InfoBlock
                            imgSrc={FinalScoreIcon}
                            title={taskStatus === 'finished' ? TASK_DESCRIPTION.finalScoreLabel : TASK_DESCRIPTION.maxScoreLabel}
                            subtitle={score}
                        />
                    </InfoSection>
                </TaskInformationContainer>

                <TaskDescriptionText>
                    {renderDescription(task.description)}
                </TaskDescriptionText>
            </Box>
        </Box>
    );
}

export default TaskInformation;