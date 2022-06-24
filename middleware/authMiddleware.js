module.exports = (req, res, next) => {
  const { token } = req.body;
  const { authorization } = req.headers;

  if (authorization !== token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (!authorization) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
}