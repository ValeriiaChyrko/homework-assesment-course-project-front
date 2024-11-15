import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem, FormControl, SelectChangeEvent, CircularProgress, Typography } from "@mui/material";
import GitHubRepositoryIcon from '../../assets/images/repository-info.svg';
import GitHubBranchIcon from '../../assets/images/branch-info.svg';
import TaskButton from "../Buttons/TaskButtons.tsx";
import InfoBlock from "./InfoBlock.tsx";
import { StyledMenuItem, TaskInformationText } from "../../assets/styles/TextStyles.ts";
import { InfoSection, TaskInformationContainer } from "../../assets/styles/SectionStyles.ts";
import { TASK_SOLUTION } from "../../assets/constants/texts.ts";
import { TaskSolutionProps } from "../../types/TaskSolutionProps.ts";
import { fetchBranches } from "../../services/gitHubService.ts";

const TaskSolution: React.FC<TaskSolutionProps> = ({task, attempt, githubProfileId }) => {
    const [taskStatus] = useState<string>('submitted');
    const [branch, setBranch] = useState<string>('master');
    const [branchesList, setBranchesList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isClosed, setClosed] = useState<boolean>(true);

    const fetchBranchListData = async (taskId: string, githubProfileId: string) => {
        setLoading(true);
        try {
            const branchListData: string[] = await fetchBranches(taskId, githubProfileId);
            setBranchesList(branchListData);
        } catch (err) {
            console.error("Error fetching branch list data:", err);
            setError("Не вдалося отримати дані завдання.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (task?.id && githubProfileId) {
            fetchBranchListData(task.id, githubProfileId);
        }
        if (task?.deadline && task?.maxAttemptsAmount && attempt?.attemptNumber){
            const closed: boolean = Date.now() > new Date(task.deadline).getTime()
                && attempt.attemptNumber > task.maxAttemptsAmount;
            setClosed(closed);
        }
    }, [task?.id, githubProfileId, attempt]);

    const handleBranchChange = (event: SelectChangeEvent) => {
        setBranch(event.target.value);
        if (attempt){
            attempt.branchName = event.target.value;
        }
    };

    const renderValue = (selected: string) => (
        <StyledMenuItem>{selected}</StyledMenuItem>
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
                zIndex: 1,
            }}
        >
            <Box bgcolor="#FFFFFF" borderRadius="10px" padding="40px">
                <TaskInformationText>{TASK_SOLUTION.title}</TaskInformationText>
                <TaskInformationContainer>
                    <InfoSection>
                        <InfoBlock
                            imgSrc={GitHubRepositoryIcon}
                            title={TASK_SOLUTION.githubRepoLabel}
                            subtitle={task?.repositoryName ?? "Repository not available"}
                        />
                        <InfoBlock
                            imgSrc={GitHubBranchIcon}
                            title={TASK_SOLUTION.githubBranchLabel}
                            subtitle={branch}
                            action={
                                <FormControl variant="standard" fullWidth>
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : error ? (
                                        <Typography color="error">{error}</Typography>
                                    ) : (
                                        <Select
                                            value={attempt ? attempt.branchName : branch}
                                            onChange={handleBranchChange}
                                            renderValue={renderValue}
                                        >
                                            {branchesList.map((branchName) => (
                                                <MenuItem key={branchName} value={branchName}>
                                                    {branchName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                </FormControl>
                            }
                        />
                    </InfoSection>
                    <TaskButton status={taskStatus} isDisabled={isClosed} attempt={attempt} />
                </TaskInformationContainer>
            </Box>
        </Box>
    );
};

export default TaskSolution;