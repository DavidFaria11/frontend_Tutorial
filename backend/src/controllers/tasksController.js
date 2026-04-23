const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

async function createTask(req, res) {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Título em falta.' });

  try {
    const task = await prisma.task.create({
      data: { title, userId: req.user.id },
    });
    res.status(201).json(task);
  } catch (e) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

async function deleteTask(req, res) {
  const id = parseInt(req.params.id);

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.user.id)
      return res.status(404).json({ message: 'Tarefa não encontrada.' });

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Tarefa apagada.' });
  } catch (e) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

module.exports = { getTasks, createTask, deleteTask };