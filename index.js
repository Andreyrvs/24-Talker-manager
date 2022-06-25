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
    const { name, talk: { rate, watchedAt }, age } = req.body;
    const talker = await getSpeaker();

    const newTalker = { name, age, id: talker.length + 1, talk: { watchedAt, rate } };
    talker.push(newTalker);
    await setSpeaker(talker);

    return res.status(201).json(newTalker);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR).json(error);
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

app.put('/talker/:id',
  authMiddleware, 
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const people = await getSpeaker();
    const findPerson = people.filter((person) => person.id !== Number(id));
    const newPerson = { id: Number(id), name, age, talk: { watchedAt, rate } };
    const editPeople = [...findPerson, newPerson];
    await setSpeaker(editPeople);
    res.status(200).json(newPerson); 
});

app.delete('/talker/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const people = await getSpeaker();
  const findPerson = people.filter((person) => person.id !== Number(id));
  await setSpeaker(findPerson);

  return res.status(204).end();
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
