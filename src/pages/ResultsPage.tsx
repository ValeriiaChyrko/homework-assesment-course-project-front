﻿import React from 'react';
import AssignmentPage from "./AssignmentPage.tsx";

const ResultsPage: React.FC = () => {
    const taskId = "1b260871-4de1-41fa-8b8c-c7dd42fe5e5a";
    const githubProfileId = "39a82438-6e56-434f-9edc-4e8b431158f1";

    return (
        <AssignmentPage
            taskId={taskId}
            githubProfileId={githubProfileId}
            taskStatus='finished'
            showSolution={false}
            showResults={true}
        />
    );
};

export default ResultsPage;