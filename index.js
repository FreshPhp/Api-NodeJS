const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const items = JSON.parse(fs.readFileSync('./items.json'))


const authToken = 'meuToken';

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === authToken) {
      next(); // Token válido, pode prosseguir
    } else {
      res.status(401).json('Acesso inválido.'); // Token inválido, retorna erro 401
    }
  }
  
app.use(authenticateToken);



// Endpoint para obter todos os itens
app.get('/items', (req, res) => {
  res.json(items);
});

// Endpoint para obter um item por id
app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  const item = items.find(i => i.id === id);
  if (item) {
    res.json(item);
  } else {
    res.sendStatus(404);
  }
});

// Endpoint para criar um item
app.post('/items', (req, res) => {
  const item = req.body;
  item.id = Date.now().toString();
  items.push(item);
  res.json(item);
});

// Endpoint para atualizar um item
app.put('/items/:id', (req, res) => {
  const id = req.params.id;
  const newItem = req.body;
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index] = { id, ...newItem };
    res.json(items[index]);
  } else {
    res.sendStatus(404);
  }
});

// Endpoint para excluir um item
app.delete('/items/:id', (req, res) => {
  const id = req.params.id;
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    const item = items.splice(index, 1)[0];
    res.json(item);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
