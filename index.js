const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml');
const crypto = require('crypto');

const helmet = require('helmet');

const cors = require('cors');

const app = express();

const validateEmail = require('./middleware/validateEmail');

const validatePassword = require('./middleware/validatePassword');

const authMiddleware = require('./middleware/authMiddleware');

const validateName = require('./middleware/validateName');

const validateAge = require('./middleware/validateAge');

const validateTalk = require('./middleware/validateTalk');

const validateWatchedAt = require('./middleware/validateWatchedAt');

const validateRate = require('./middleware/validateRate');

const { getSpeaker, setSpeaker } = require('./fsContent');

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;
const PORT = process.env.PORT || '3001';

app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocument));

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}
// app.use('api/v1');
// não remova esse endpoint, e para o avaliador funcionar
app.get('/api', (_request, response) => {
  response.status(HTTP_OK_STATUS).send({ message: 'Home' });
});

app.get('/health', (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'Ok',
    timestamp: new Date(),
    cors: 'This is CORS-enabled for all origins!',
  };

  try {
    res.send(healthcheck);
} catch (error) {
    healthcheck.message = error;
    res.status(503).send();
}
});

app.get('/api/talker', async (_req, res) => {
  res.status(HTTP_OK_STATUS).json(await getSpeaker());
});

app.post('/api/talker', 
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

app.get('/api/talker/:id', async (req, res) => {
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

app.put('/api/talker/:id',
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

app.delete('/api/talker/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const people = await getSpeaker();
  const findPerson = people.filter((person) => person.id !== Number(id));
  await setSpeaker(findPerson);

  return res.status(204).end();
});

app.post('/api/login', validateEmail, validatePassword, (_req, res) => {
  try {
    return res.status(HTTP_OK_STATUS).json({ token: `${generateToken()}` });
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).end();
  }
});

app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on : ${PORT}`);
});
