import React from 'react';
import { FaEdit, FaCheckDouble, FaRegTrashAlt } from 'react-icons/fa';

const Task = ({ num, task, deleteTask, getSingleTask, completeTask }) => {
  return (
    <div className={task.completed ? 'task completed' : 'task'}>
      <p>
        <b>{num}. </b>
        {task.name}
      </p>
      <div className="task-icons">
        <FaCheckDouble color="green" onClick={() => completeTask(task)} />
        <FaEdit color="purple" onClick={() => getSingleTask(task)} />
        <FaRegTrashAlt color="red" id={task._id} onClick={deleteTask} />
      </div>
    </div>
  );
};

export default Task;
