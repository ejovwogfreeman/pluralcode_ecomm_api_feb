export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // allow access
  } else {
    res.status(403).json({ msg: "Access denied. Admins only." });
  }
};
