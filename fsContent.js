const fs = require('fs/promises');

const FILE_NAME = './talker.json';

async function getSpeaker() {
  try {
    const fileContent = await fs.readFile(FILE_NAME, 'utf-8');
    const response = JSON.parse(fileContent);
    return response;
  } catch (error) {
    console.error(`Não foi possivel ler o arquivo ${FILE_NAME}\n Erro: ${error}`);
    process.exit(1);
  }
}

async function setSpeaker(newTalker) {
  try {
    await fs.writeFile(FILE_NAME, JSON.stringify(newTalker));
    console.log('Arquivo escrito com sucesso!');
  } catch (error) {
    console.error(`Erro ao escrever o arquivo: ${error.message}`);
  }
}

module.exports = { getSpeaker, setSpeaker };