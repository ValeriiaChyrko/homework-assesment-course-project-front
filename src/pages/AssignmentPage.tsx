import React, { useEffect, useState } from 'react';
import { RespondAssignmentDto } from "../models/RespondAssignmentDto.ts";
import { fetchTask } from "../services/taskService.ts";
import { RespondStudentDto } from "../models/RespondStudentDto.ts";
import { fetchStudent } from "../services/userService.ts";
import TaskReviewResults from "../components/Containers/TaskReviewResults.tsx";
import Box from '@mui/material/Box';
import TaskSolution from "../components/Containers/TaskSolution.tsx";
import TaskInformation from "../components/Containers/TaskInformation.tsx";
import TaskHeader from "../components/Header/TaskHeader.tsx";
import { CircularProgress } from "@mui/material";
import { TaskPageProps } from "../types/TaskPageProps.ts";
import { RequestAttemptDto } from "../models/RequestAttemptDto.ts";
import { RespondAttemptDto } from "../models/RespondAttemptDto.ts";
import { fetchLastAttemptByAssignmentId } from "../services/attemptService.ts";

const AssignmentPage: React.FC<TaskPageProps> = ({ taskId, githubProfileId, taskStatus, showSolution, showResults }) => {
    const [assignment, setAssignment] = useState<RespondAssignmentDto | null>(null);
    const [student, setStudent] = useState<RespondStudentDto | null>(null);
    const [lastAttempt, setLastAttempt] = useState<RespondAttemptDto | null>(null);
    const [newAttempt, setNewAttempt] = useState<RequestAttemptDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isClosed, setClosed] = useState<boolean>(true);

    const fetchAssignmentData = async () => {
        try {
            const assignmentData: RespondAssignmentDto = await fetchTask(taskId);
            setAssignment(assignmentData);
            const closed: boolean = Date.now() > new Date(assignmentData.deadline).getTime();
            setClosed(closed);
        } catch (err) {
            console.error("Error fetching assignment data:", err);
            setError("Не вдалося отримати дані завдання.");
        }
    };

    const fetchStudentData = async () => {
        try {
            const studentData: RespondStudentDto = await fetchStudent(githubProfileId);
            setStudent(studentData);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Не вдалося отримати дані студента.");
        }
    };

    const fetchLastAttemptData = async () => {
        try {
            const attemptData: RespondAttemptDto = await fetchLastAttemptByAssignmentId(taskId);
            setLastAttempt(attemptData);
        } catch (err) {
            console.error("Error fetching last attempt data:", err);
            setError("Не вдалося отримати дані останньої спроби.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchAssignmentData(),
                fetchStudentData(),
                fetchLastAttemptData()
            ]);
            setLoading(false);
        };

        fetchData();
    }, [taskId, githubProfileId]);

    useEffect(() => {
        if (student && assignment && taskStatus=='onGoing') {
            const attempt: RequestAttemptDto = {
                studentId: student.gitHubProfileId,
                assignmentId: assignment.id,
                attemptNumber: lastAttempt ? lastAttempt.attemptNumber + 1 : 1,
                branchName: 'master',
                compilationScore: 0,
                testsScore: 0,
                qualityScore: 0
            };
            setNewAttempt(attempt);
        }
    }, [student, assignment, lastAttempt]);

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
                score={lastAttempt?.finalScore ?? 0}
                taskStatus={taskStatus}
                isClosed={isClosed}
            />
        )}
        {assignment && (
            <TaskInformation
                task={assignment}
                taskStatus={taskStatus}
                lastAttempt={null}
                student={student}
            />
        )}
        {showSolution && assignment && (
            <TaskSolution
                task={assignment}
                attempt={newAttempt}
                githubProfileId={student?.gitHubProfileId ?? null}
            />
        )}
        {showResults && assignment && (
            <TaskReviewResults task={assignment} />
        )}
        </Box>
    );
};

export default AssignmentPage;