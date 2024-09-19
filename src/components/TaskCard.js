import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { deleteTask, editTask } from '../redux/actions/taskActions';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, isNewTask = false, onSaveNewTask, onCancelNewTask }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(isNewTask); // Edit mode for new tasks
  const [editableTask, setEditableTask] = useState(task.todo || '');
  const cardRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle delete
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    dispatch(deleteTask(task.id));
  };

  // Edit mode
  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  // Update textarea
  const handleEditChange = (e) => {
    setEditableTask(e.target.value);
    autoResizeTextarea();
  };

  // Save task (add or edit)
  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (isNewTask) {
      onSaveNewTask(editableTask);
    } else {
      dispatch(editTask(task.id, { ...task, id: task.id.toString(), todo: editableTask }));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents adding a new line
      handleSaveClick(e);
    } else if (e.key === 'Escape' && isNewTask) {
      onCancelNewTask();
    }
  };

  const handleViewDetails = () => {
    navigate(`/task/${task.id}`)
  }

  // Auto resize textarea
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Focus textarea
  const focusTextareaAtEnd = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  // Click outside to cancel edit
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        if (isEditing) {
          if (isNewTask) {
            onCancelNewTask(); // Cancel new task
          }
          setEditableTask(task.todo); // Reset task content
          setIsEditing(false);
        }
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, task, isNewTask, onCancelNewTask]);

  useEffect(() => {
    if (isEditing) {
      autoResizeTextarea();
      focusTextareaAtEnd();
    }
  }, [editableTask, isEditing]);

  return (
    <div
      className="bg-white p-4 mb-4 shadow-md rounded-lg relative group cursor-pointer transition-shadow"
      ref={cardRef}
      onClick={handleViewDetails}
    >
      {isEditing ? (
        <div>
          <textarea
            ref={textareaRef}
            value={editableTask}
            onChange={handleEditChange}
            onKeyDown={handleKeyDown}
            rows="1"
            className="resize-none overflow-hidden w-full p-2 focus:outline-none focus:ring-0"
            style={{ lineHeight: '1.5' }}
            autoFocus
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSaveClick}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-sm hover:bg-blue-600 transition-colors flex items-center"
            >
              <SaveIcon fontSize="small" className="mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h4 className="text-base mb-2">{task.todo}</h4>
          <div className="flex items-center">
            <EditIcon
              onClick={handleEditClick}
              className="cursor-pointer !text-[15px] mr-2"
            />
            <DeleteIcon
              onClick={handleDeleteClick}
              className="cursor-pointer !text-[15px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
