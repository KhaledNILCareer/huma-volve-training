export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    next();
  };
};