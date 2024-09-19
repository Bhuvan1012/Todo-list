import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { tasks } = useSelector(state => state.tasks)
  const [task, setTask] = useState(null);
  useEffect(() => {
    if (!!tasks.length) {
      const currentTask = tasks.find((task) => task.id.toString() === id)
      setTask(currentTask)
    }
  }, [id, tasks]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md ml-auto">
      <h1 className="text-xl font-bold mb-2">{task?.todo}</h1>
      <div className='flex items-center'><p className='mr-2'>Status:</p><div className={` w-[32%] sm:w-[15%] text-base font-bold py-1 px-2 rounded-2xl text-center ${task?.status?.length ? "bg-yellow-500" : task?.completed ? "bg-green-500" : "bg-blue-500"} text-white mr-3`}>
        <h4>{task?.status?.length ? "In Progress" : task?.completed ? 'Done' : 'To Do'}</h4>
      </div></div>

    </div>
  );
};

export default TaskDetailsPage;
