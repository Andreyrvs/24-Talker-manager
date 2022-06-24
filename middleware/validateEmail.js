module.exports = (req, res, next) => {
  const { email } = req.body;
  const regexEmail = /\S+@\S+\.\S+/gi;
  if (email === undefined) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};