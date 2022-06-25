module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // console.log('TOKEN', token);
  // console.log('AUTHORIZATION', authorization);
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  
  if (authorization.length < 16 || authorization.length > 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};