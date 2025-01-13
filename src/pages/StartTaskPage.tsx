import AssignmentPage from "./AssignmentPage.tsx";
import React from "react";

const StartTaskPage: React.FC = () => {
    const taskId = "1b260871-4de1-41fa-8b8c-c7dd42fe5e5a";
    const githubProfileId = "39a82438-6e56-434f-9edc-4e8b431158f1";

    return (
        <AssignmentPage
            taskId={taskId}
            githubProfileId={githubProfileId}
            taskStatus='started'
            showSolution={false}
        />
    );
};

export default StartTaskPage;