import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded.type !== 'access') {
      return res.status(401).json({ success: false, message: 'Invalid token type' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }
};