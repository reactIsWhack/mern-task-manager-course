import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import Task from './Task';
import { toast } from 'react-toastify';
import loadingGif from '../assets/loader.gif';

// http://localhost:5000/api/tasks

const TaskList = () => {
  const [formData, setFormData] = useState({
    name: '',
    completed: false,
  });
  const { name } = formData;
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!name) {
      setIsLoading(false);
      return toast.error('Input field cannot be empty');
    }
    try {
      const task = await axios.post('/api/tasks', formData);
      toast.success('Task added successfully');
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: '',
      }));
      setIsLoading(false);

      setTasks((prevTasks) => [...prevTasks, task.data]);
      getTasks();
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const deleteTask = async (e) => {
    const taskId = e.currentTarget.id;
    setIsLoading(true);
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskId(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.error('Input field cannot be empty');
    }
    try {
      await axios.put(`/api/tasks/${taskId}`, formData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: '',
      }));
      setIsEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeTask = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(`/api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTasks = tasks.filter((task) => task.completed);
    setCompletedTasks(cTasks);
  }, [tasks]);

  const taskCards = tasks.map((task, index) => {
    return (
      <Task
        key={task._id}
        num={index + 1}
        task={task}
        deleteTask={deleteTask}
        getSingleTask={getSingleTask}
        completeTask={completeTask}
      />
    );
  });

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}

      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingGif} />
        </div>
      )}
      {!isLoading && !tasks.length ? (
        <p className="--py">No tasks added. Please add a task</p>
      ) : (
        taskCards
      )}
    </div>
  );
};

export default TaskList;
