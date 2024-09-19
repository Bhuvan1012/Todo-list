import { toast } from 'sonner';
import axios from 'axios';

// API Base URL
const API_URL = 'https://dummyjson.com/todos';

// Action Types
export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';
export const ADD_TASK = 'ADD_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const EDIT_TASK_LOCALLY = 'EDIT_TASK_LOCALLY';

// Fetch Tasks with Pagination
export const fetchTasks = (skip = 0, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_TASKS_REQUEST });
  try {
    const response = await axios.get(`${API_URL}?skip=${skip}&limit=${limit}`);
    dispatch({
      type: FETCH_TASKS_SUCCESS,
      payload: {
        todos: response.data.todos,
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
      },
    });
  } catch (error) {
    dispatch({ type: FETCH_TASKS_FAILURE, payload: error.message });
  }
};

export const addTask = (task) => async (dispatch) => {
  const promise = axios.post(`${API_URL}/add`, task); // Create the promise first
  toast.promise(promise, {
    loading: 'Adding task...',
    success: 'Task added successfully!',
    error: 'Failed to add task.',
  });
  promise
    .then(response => {
      dispatch({ type: ADD_TASK, payload: response.data });
    })
    .catch(error => {
      console.error('Error adding task:', error);
    });
};

// Edit Task
export const editTask = (id, updatedTask) => async (dispatch) => {
  const promise = axios.put(`${API_URL}/${id}`, updatedTask);
  toast.promise(promise, {
    loading: 'Updating task...',
    success: 'Task updated successfully!',
    error: 'Failed to update task.',
  });
  promise
    .then(response => {
      dispatch({ type: EDIT_TASK, payload: response.data });
    })
    .catch(error => {
      console.error('Error updating task:', error);
    });
};

// Delete Task
export const deleteTask = (id) => async (dispatch) => {
  const promise = axios.delete(`${API_URL}/${id}`);
  toast.promise(promise, {
    loading: 'Deleting task...',
    success: 'Task deleted successfully!',
    error: 'Failed to delete task.',
  });
  promise
    .then(response => {
      dispatch({ type: DELETE_TASK, payload: id });
    })
    .catch(error => {
      console.error('Error deleting task:', error);
    });
};

export const editTaskLocally = (taskId, taskData) => {
  return {
    type: EDIT_TASK_LOCALLY,
    payload: { id: taskId, ...taskData },
  };
};