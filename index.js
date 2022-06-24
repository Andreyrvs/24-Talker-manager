const express = require('express');
const bodyParser = require('body-parser');

const validateEmail = require('./middleware/validateEmail');

const validatePassword = require('./middleware/validatePassword');

const { getSpeaker, setSpeaker } = require('./fsContent');

const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
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

// app.post('/talker', (req, res) => {
//   try {
//     const { id, name } = req.body;
//     const talker = await getSpeaker();

//     if (talker.some((person) => person.id === id)) {
//       return res.status(400).json({});
//     }

//     talker.push({ id, name });
//     await setSpeaker(talker);

//     return res.status(204).json({})
//   } catch (error) {
//     return res.status(500).end()
//   }
// })

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const people = await getSpeaker();
    const findPerson = people.find((person) => person.id === Number(id));
    console.log(findPerson);
    if (!findPerson) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(HTTP_OK_STATUS).json(findPerson);
  } catch (error) {
    return res.status(500).end();
  }
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  try {
    return res.status(HTTP_OK_STATUS).json({ token: `${generateToken()}` });
  } catch (error) {
    res.status(500).end();
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
