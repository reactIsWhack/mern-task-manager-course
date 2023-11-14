const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const Task = require('./model/taskModel');
const taskRoutes = require('./routes/taskRoute');

const app = express();
const uri = dotenv.parsed.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://mern-task.onrender-app.com'],
  })
);
app.use('/api/tasks', taskRoutes);

async function connect() {
  try {
    await mongoose.connect(uri);
    app.listen(PORT, () => {
      console.log(`Listening for events on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

connect();
