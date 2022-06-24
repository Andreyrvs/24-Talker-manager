const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises')

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

async function palestrantes() {
  const fileContent = await fs.readFile('./talker.json', 'utf-8')
  return JSON.parse(fileContent)
}

app.get('/talker', async (req, res) => {
  res.status(200).json(await palestrantes())
})

app.listen(PORT, () => {
  console.log('Online');
});
