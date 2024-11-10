import { Routes, Route } from 'react-router-dom';
import StartTaskPage from "./pages/StartTaskPage.tsx";
import OnGoingPage from "./pages/OnGoingPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<StartTaskPage />} />
            <Route path="/task-started" element={<StartTaskPage />} />
            <Route path="/task-ongoing" element={<OnGoingPage />} />
            <Route path="/task-finished" element={<ResultsPage />} />
            <Route path="*" element={<StartTaskPage />} />
        </Routes>
    );
}

export default App;
