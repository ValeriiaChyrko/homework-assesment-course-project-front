import React from 'react';
import AssignmentPage from "./AssignmentPage.tsx";

const OnGoingPage: React.FC = () => {
    const taskId = "12a0b3e6-a106-43dd-b57f-d38ba6c62c4e";
    const githubProfileId = "d43a70ad-2d8f-410f-be79-a07fe5a38358";

    return (
        <AssignmentPage
            taskId={taskId}
            githubProfileId={githubProfileId}
            taskStatus='onGoing'
            showSolution={true}
            showResults={true}
        />
    );
};

export default OnGoingPage;