import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated called")
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token)
  if (!token) return res.status(401).json({ message: 'Not authorized' });


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied. You do not have permission.' });
    }

    next();
  };
};

