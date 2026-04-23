const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const tasksRoutes = require('./routes/tasksRoutes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));