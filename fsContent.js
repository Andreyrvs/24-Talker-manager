const fs = require('fs/promises');

const FILE_NAME = './talker.json';

async function getSpeaker() {
  const fileContent = await fs.readFile(FILE_NAME, 'utf-8');
  return JSON.parse(fileContent);
}

async function setSpeaker(newTalker) {
  const fileContent = await fs.writeFile(FILE_NAME, JSON.stringify(newTalker));
  return fileContent;
}

module.exports = { getSpeaker, setSpeaker };