import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // or attach more info here
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ msg: "No token provided" });
  }
};
