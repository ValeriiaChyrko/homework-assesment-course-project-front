import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
};

createRoot(document.getElementById('root')!).render(
    <BrowserRouter future={futureFlags}>
        <App />
    </BrowserRouter>
);
