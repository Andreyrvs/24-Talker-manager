const express = require('express');
const bodyParser = require('body-parser');

const crypto = require('crypto');

const validateEmail = require('./middleware/validateEmail');

const validatePassword = require('./middleware/validatePassword');

const authMiddleware = require('./middleware/authMiddleware');

const validateName = require('./middleware/validateName');

const validateAge = require('./middleware/validateAge');

const validateTalk = require('./middleware/validateTalk');

const validateWatchedAt = require('./middleware/validateWatchedAt');

const validateRate = require('./middleware/validateRate');

const { getSpeaker, setSpeaker } = require('./fsContent');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;
const PORT = '3000';

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  res.status(HTTP_OK_STATUS).json(await getSpeaker());
});

app.post('/talker', 
    authMiddleware,
    validateName,
    validateAge,
    validateTalk,
    validateWatchedAt,
    validateRate,
    async (req, res) => {
  try {
    const { id, name, talk, age } = req.body;
    const talker = await getSpeaker();
    const talkerParser = JSON.parse(talker);
    if (talker.some((person) => person.id === id)) {
      return res.status(400).json({ message: 'Oia aqui deu erro' });
    }

    talkerParser.push({ age, id: id.length += 1, name, talk });
    await setSpeaker(talker);

    return res.status(201).json(talker);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR).end();
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const people = await getSpeaker();
    const findPerson = people.find((person) => person.id === Number(id));
    console.log(findPerson);
    if (!findPerson) {
      return res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(HTTP_OK_STATUS).json(findPerson);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR).end();
  }
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  try {
    return res.status(HTTP_OK_STATUS).json({ token: `${generateToken()}` });
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).end();
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
