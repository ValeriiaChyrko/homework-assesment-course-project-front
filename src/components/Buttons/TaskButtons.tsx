import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseButton } from "../../assets/styles/ButtonStyles.ts";
import {
    fetchProjectCompilationVerification,
    fetchProjectQualityVerification,
    fetchProjectTestsVerification
} from "../../services/gitHubService.ts";
import { createRequestAttempt } from "../../services/attemptService.ts";
import {Box} from "@mui/material";
import {TaskButtonProps} from "../../types/TaskButtonProps.ts";

const getButtonColorForStatus = (status: string) => {
    switch (status) {
        case 'started':
            return {
                backgroundColor: 'rgb(193,232,255)',
                color: 'rgb(24,101,132)',
                hoverColor: 'rgb(176,223,248)',
            };
        case 'onGoing':
            return {
                backgroundColor: 'rgb(201,218,196)',
                color: 'rgb(76,102,43)',
                hoverColor: 'rgb(175,196,169)',
            };
        case 'submitted':
            return {
                backgroundColor: 'rgb(230, 232, 250)',
                color: 'rgb(80, 90, 180)',
                hoverColor: 'rgb(200, 205, 230)',
            };
        case 'finished':
            return {
                backgroundColor: 'rgb(229,222,255)',
                color: 'rgb(112,94,178)',
                hoverColor: 'rgb(203,194,255)',
            };
        default:
            return {
                backgroundColor: 'transparent',
                color: '#000',
                hoverColor: 'transparent',
            };
    }
};

const TaskButton = ({ status, isDisabled, attempt, task, owner }: TaskButtonProps) => {
    const navigate = useNavigate();
    const { backgroundColor, color, hoverColor } = getButtonColorForStatus(status);

    const [loading, setLoading] = useState(false);

    const handleSubmission = async () => {
        setLoading(true);
        try {
            if (attempt && task) {
                attempt.compilationScore = await fetchProjectCompilationVerification(attempt.studentId, attempt.assignmentId, attempt.branchName);
                const minCompilationScore = task.compilationSection?.minScore ?? 0;
                if (attempt.compilationScore > minCompilationScore) {
                    attempt.testsScore = await fetchProjectTestsVerification(attempt.studentId, attempt.assignmentId, attempt.branchName);
                    attempt.qualityScore = await fetchProjectQualityVerification(attempt.studentId, attempt.assignmentId, attempt.branchName);
                }
                await createRequestAttempt(attempt);
            }
        } catch (error) {
            console.error("Помилка при отриманні балів за спробу:", error);
        } finally {
            setLoading(false);
            sessionStorage.setItem('scrollToBottom', 'true');
            navigate(0);
        }
    };

    const generateGitHubUrl = (ownerGithubUsername: string, repositoryName: string) => {
        return `https://github.com/${ownerGithubUsername}/${repositoryName}`;
    };

    const handleRepositoryOpen = async () => {
        if (task && owner){
            const gitHubUrl = generateGitHubUrl(owner.githubUsername, task.repositoryName);
            window.open(gitHubUrl, '_blank');
        }
    }

    const handleClick = async () => {
        switch (status) {
            case 'started':
                await handleRepositoryOpen();
                navigate('/task-ongoing');
                break;
            case 'onGoing':
                navigate('/task-finished');
                break;
            case 'finished':
                navigate('/task-ongoing');
                break;
            case 'submitted':
                await handleSubmission();
                break;
            default:
                console.log('No action defined for this status');
        }
    };

    return (
        <Box>
            <BaseButton
                onClick={handleClick}
                disabled={isDisabled || loading}
                variant="contained"
                sx={{
                    backgroundColor: backgroundColor,
                    color: color,
                    '&:hover': {
                        backgroundColor: hoverColor,
                    }
                }}
            >
                {loading ? 'Зачекайте...' :
                    (status === 'started' ? 'Розпочати' :
                     status === 'submitted' ? 'Подати роботу' :
                     status === 'onGoing' ? 'Завершити' : 'Відновити'
                )}
            </BaseButton>
        </Box>
    );
};

export default TaskButton;