import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

const config = process.env;

const verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return next(createHttpError(403, "Unauthorized - No token provided."));
  }
  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return next(createHttpError(401, "Unauthorized - Invalid token."));
  }
};

export default verifyToken;
