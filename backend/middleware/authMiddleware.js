import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "supersecretkey", (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid token" });
    req.user = user; // attach user info to request
    next();
  });
}
