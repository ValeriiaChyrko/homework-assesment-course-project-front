import React from 'react';
import TaskHeader from '../components/TaskHeader.tsx';
import TaskInformation from '../components/TaskInformation';
import { Box } from '@mui/material';
import TaskSolution from "../components/TaskSolution.tsx";
import TaskReviewResults from "../components/TaskReviewResults.tsx";

const ResultsPage: React.FC = () => {
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
            <TaskHeader taskStatus='finished'/>
            <TaskInformation/>
            <TaskSolution taskStatus='finished'/>
            <TaskReviewResults/>
        </Box>
    );
};

export default ResultsPage;
