const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const crypto = require('crypto');

const validateEmail = require('./middleware/validateEmail');

const validatePassword = require('./middleware/validatePassword')

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

async function speaker() {
  const fileContent = await fs.readFile('./talker.json', 'utf-8');
  return JSON.parse(fileContent);
}

app.get('/talker', async (_req, res) => {
  res.status(200).json(await speaker());
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const people = await speaker();
    // console.log(people);
    const findPerson = people.find((person) => person.id === Number(id));
    console.log(findPerson);
    if (!findPerson) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(findPerson);
  } catch (error) {
    return res.status(500).end();
  }
});

app.post('/login', validateEmail , validatePassword , (req, res) => {
  try {
    return res.status(200).json({ token: `${generateToken()}` });
  } catch (error) {
    res.status(500).end();
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
