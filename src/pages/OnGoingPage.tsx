﻿import React, {useEffect, useState} from 'react';
import TaskHeader from '../components/Header/TaskHeader.tsx';
import TaskInformation from '../components/Containers/TaskInformation.tsx';
import {Box, CircularProgress} from '@mui/material';
import TaskSolution from "../components/Containers/TaskSolution.tsx";
import {RespondAssignmentDto} from "../models/RespondAssignmentDto.ts";
import {fetchTask} from "../services/taskService.ts";

const OnGoingPage: React.FC = () => {
    const [assignment, setAssignment] = useState<RespondAssignmentDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssignmentData = async (taskId: string) => {
        try {
            const assignmentData: RespondAssignmentDto = await fetchTask(taskId);
            setAssignment(assignmentData);
        } catch (err) {
            console.error("Error fetching assignment data:", err);
            setError("Не вдалося отримати дані завдання.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const taskId = "12a0b3e6-a106-43dd-b57f-d38ba6c62c4e";
        fetchAssignmentData(taskId);
    }, []);

    return (
        <Box
            sx={{
                bgcolor: '#EDF1F5',
                height: 'auto',
                width: '100vw',
                alignItems: 'center',
                paddingX: '40px',
                paddingBottom: '140px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}
        >
            {loading && <CircularProgress />}
            {error && <p>{error}</p>}
            {assignment && (
                <TaskHeader
                    taskName={assignment.title}
                    score={assignment.maxScore}
                    taskStatus='onGoing'
                />
            )}
            {assignment && <TaskInformation task={assignment} taskStatus='onGoing' lastAttempt={null}/>}
            <TaskSolution taskStatus='onGoing'/>
        </Box>
    );
};

export default OnGoingPage;
