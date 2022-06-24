const fs = require('fs/promises');

const FILE_NAME = './talker.json';

async function getSpeaker() {
  const fileContent = await fs.readFile(FILE_NAME, 'utf-8');
  return JSON.parse(fileContent);
}

async function setSpeaker(newTalker) {
  return await fs.writeFile(FILE_NAME, JSON.stringify(newTalker));
}

module.exports = { getSpeaker, setSpeaker };