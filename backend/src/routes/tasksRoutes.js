const express = require('express');
const router = express.Router();
const { getTasks, createTask, deleteTask } = require('../controllers/tasksController');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);

module.exports = router;