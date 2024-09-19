// taskReducer.js
import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  ADD_TASK,
  EDIT_TASK,
  DELETE_TASK,
  EDIT_TASK_LOCALLY
} from '../actions/taskActions';

const initialState = {
  tasks: [],
  total: 0,
  skip: 0,
  limit: 10,
  loading: false,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: [...state.tasks, ...action.payload.todos],
        total: action.payload.total,
        skip: action.payload.skip,
        limit: action.payload.limit,
      };

    case FETCH_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_TASK:
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case EDIT_TASK_LOCALLY:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };

    default:
      return state;
  }
};

export default taskReducer;
