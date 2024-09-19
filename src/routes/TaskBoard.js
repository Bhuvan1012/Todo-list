// TaskBoard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { fetchTasks, editTask, addTask, editTaskLocally } from '../redux/actions/taskActions';
import TaskColumn from '../components/TaskColumn';
import { useInView } from 'react-intersection-observer';

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { tasks, total, skip, limit, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [tasks.length, dispatch]);

  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && tasks.length < total && !loading) {
      dispatch(fetchTasks(skip + limit, limit));
    }
  }, [inView, tasks.length, total, skip, limit, loading, dispatch]);


  const handleAddTask = (columnId, newTask) => {
    dispatch(addTask(newTask));
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const task = tasks.find((t) => t.id.toString() === draggableId);

    // If moving to a different column
    if (source.droppableId !== destination.droppableId) {
      let updatedTask;

      // Moving to 'Done'
      if (destination.droppableId === 'Done') {
        updatedTask = { ...task, id: task.id.toString(), completed: true };
        dispatch(editTask(draggableId, updatedTask)); // Sync with API
      }
      // Moving to 'To Do'
      else if (destination.droppableId === 'To Do') {
        updatedTask = { ...task, id: task.id.toString(), completed: false, status: null }; // Reset status for API syncing
        dispatch(editTask(draggableId, updatedTask)); // Sync with API
      }
      // Moving to 'In Progress'
      else if (destination.droppableId === 'In Progress') {
        updatedTask = { ...task, completed: false, status: 'in-progress' }; // Manage locally
        dispatch(editTaskLocally(draggableId, updatedTask)); // Local edit
      }
    }
  };

  const todoTasks = tasks.filter((task) => !task.completed && !task.status);
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-4">
        <div className="grid md:grid-cols-3 gap-6">
          <TaskColumn
            title="To Do"
            columnId="To Do"
            tasks={todoTasks}
            onAddTask={handleAddTask}
            customClassName="bg-blue-500"
          />
          <TaskColumn
            title="In Progress"
            columnId="In Progress"
            tasks={inProgressTasks}
            onAddTask={handleAddTask}
            customClassName="bg-yellow-500"
          />
          <TaskColumn
            title="Done"
            columnId="Done"
            tasks={completedTasks}
            onAddTask={handleAddTask}
            customClassName="bg-green-500"
          />
        </div>
        {loading && <p className="text-center mt-4 text-blue-500">Loading...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        <div ref={ref}></div>
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
