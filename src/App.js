import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskBoard from './routes/TaskBoard';
import TaskDetailsPage from './routes/TaskDetailsPage';
import NotFound from './routes/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskBoard />} />
        <Route path="/task/:id" element={<TaskDetailsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
