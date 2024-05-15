const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem-vindo à minha aplicação Node.js!');
});

const disciplinas = ['Prog. Internet', 'CG', 'Estatistica'];

app.get('/disciplinas', (req, res) => {
  res.json(disciplinas);
});

app.post('/disciplinas', (req, res) => {
  const { disciplina } = req.body;
  disciplinas.push(disciplina);
  res.status(201).send('Disciplina adicionada com sucesso!');
});

app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
