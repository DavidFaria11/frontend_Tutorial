const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Preenche todos os campos.' });

  try {
    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ message: 'Email já registado.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });

    res.status(201).json({ message: 'Conta criada com sucesso.', userId: user.id });
  } catch (e) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

async function signin(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Preenche todos os campos.' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const valida = await bcrypt.compare(password, user.password);
    if (!valida) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

async function profile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true },
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

module.exports = { signup, signin, profile };