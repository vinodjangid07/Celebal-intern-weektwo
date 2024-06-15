// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import UndoIcon from './icons/UndoIcon';
import SaveIcon from './icons/SaveIcon';
import CompleteIcon from './icons/CompleteIcon';
import CancelIcon from './icons/CancelIcon';
import logo from '../images/logo.png'

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filterOption, setFilterOption] = useState('all'); // all, active, completed
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTaskAdd = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: new Date().getTime(),
        text: inputValue,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  const handleTaskRemove = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleTaskCompleteToggle = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleEditStart = (taskId, text) => {
    setEditingTaskId(taskId);
    setEditingText(text);
  };

  const handleEditChange = (e) => {
    setEditingText(e.target.value);
  };

  const handleEditSave = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, text: editingText } : task
    );
    setTasks(updatedTasks);
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterOption === 'all') {
      return true;
    } else if (filterOption === 'active') {
      return !task.completed;
    } else if (filterOption === 'completed') {
      return task.completed;
    }
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => a.text.localeCompare(b.text));

  return (
    <div className="todo-list-container">
      <div className="logo_container"><img src={logo} alt="logo" /><h1>Todo List</h1></div>
      <div className="add-task-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter task..."
        />
        <button className="add-task-btn" onClick={handleTaskAdd}>Add Task</button>
      </div>
      <div className="filter-container">
        <label>
          <select value={filterOption} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task.id} className="task-item">
            {editingTaskId === task.id ? (
              <div className="edit-task">
                <input
                  type="text"
                  value={editingText}
                  onChange={handleEditChange}
                  placeholder="Edit task..."
                />
                <div className="buttons_container">
                <button className="edit-save-btn todoButtons" onClick={() => handleEditSave(task.id)}>
                  <SaveIcon />
                </button>
                <button className="edit-cancel-btn todoButtons" onClick={handleEditCancel}>
                  <CancelIcon />
                </button>
                </div>
              </div>
            ) : (
              <div className="view-task">
                <span className={task.completed ? 'task-text completed' : 'task-text'}>
                  {task.text}
                </span>
                <div className="buttons_container">
                <button className="complete-toggle-btn todoButtons" onClick={() => handleTaskCompleteToggle(task.id)}>
                  {task.completed ? (<UndoIcon/>) : (<CompleteIcon/>)}
                </button>
                <button className="edit-start-btn todoButtons" onClick={() => handleEditStart(task.id, task.text)}>
                <EditIcon />
                </button>
                <button className="remove-task-btn todoButtons" onClick={() => handleTaskRemove(task.id)}>
                 <DeleteIcon />
                </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
