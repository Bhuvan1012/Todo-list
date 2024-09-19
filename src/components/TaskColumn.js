import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import AddIcon from '@mui/icons-material/Add';

const TaskColumn = ({ title, tasks = [], customClassName = "", columnId, onAddTask }) => {
  const [newTask, setNewTask] = useState(null);

  const handleAddTask = () => {
    const emptyTask = {
      id: Date.now(),
      todo: '',
      completed: columnId === 'Done',
      status: columnId === 'In Progress' ? 'in-progress' : false,
      userId: 1,
    };
    setNewTask(emptyTask);
  };

  const handleSaveTask = (taskContent) => {
    if (taskContent.trim() === '') return;

    const newTaskToAdd = {
      ...newTask,
      todo: taskContent,
    };

    onAddTask(columnId, newTaskToAdd);
    setNewTask(null);
  };

  const handleCancelNewTask = () => {
    setNewTask(null);
  };

  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="p-4 bg-gray-100 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`text-base font-bold py-1 px-2 rounded-2xl flex items-center justify-center ${customClassName} text-white mr-3`}>
                <div className={`w-[6px] h-[6px] bg-white rounded-full mr-1`}></div><h4>{title}</h4>
              </div>
              <p>{tasks.length}</p>
            </div>
            {columnId === "To Do" && <AddIcon className="cursor-pointer" onClick={handleAddTask} />}
          </div>

          {newTask && (
            <TaskCard
              task={newTask}
              isNewTask={true}
              onSaveNewTask={handleSaveTask}
              onCancelNewTask={handleCancelNewTask}
            />
          )}

          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard task={task} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
