export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    next();
  };
};