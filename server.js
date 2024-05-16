const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Client')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

// ToDo Schema
const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  todos: [{ task: String, completed: Boolean }]
});

const ToDo = mongoose.model('ToDo', todoSchema);

// Registration Route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User with this email already exists');
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Access denied. No token provided.');
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied. Invalid token format.');
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log('Invalid token:', error.message);
    res.status(400).send('Invalid token.');
  }
};

// Get Todos
app.get('/todos', authMiddleware, async (req, res) => {
  try {
    const todos = await ToDo.findOne({ user: req.user.userId });
    res.status(200).json(todos ? todos.todos : []);
  } catch (error) {
    console.log('Error getting todos:', error.message);
    res.status(500).send('Error getting todos.');
  }
});

// Save Todos
app.post('/todos', authMiddleware, async (req, res) => {
  try {
    const { todos } = req.body;
    let todoList = await ToDo.findOne({ user: req.user.userId });
    if (!todoList) {
      todoList = new ToDo({
        user: req.user.userId,
        todos: todos.map(todo => ({ task: todo, completed: false }))
      });
    } else {
      todoList.todos = todos.map(todo => ({ task: todo, completed: false }));
    }
    await todoList.save();
    res.status(200).send('Todos saved');
  } catch (error) {
    console.log('Error saving todos:', error.message);
    res.status(500).send('Error saving todos.');
  }
});

app.delete('/todos/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const todoList = await ToDo.findOne({ user: req.user.userId });
      if (!todoList) {
        return res.status(404).send('Todo list not found');
      }
      todoList.todos = todoList.todos.filter(todo => todo._id.toString() !== id);
      await todoList.save();
      res.status(200).send('Todo deleted');
    } catch (error) {
      console.log('Error deleting todo:', error.message);
      res.status(500).send('Error deleting todo.');
    }
  });

// Logout
app.post('/logout', (req, res) => {
  res.status(200).send('Logged out');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
