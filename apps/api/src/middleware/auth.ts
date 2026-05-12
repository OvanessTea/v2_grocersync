import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import { AuthenticatedRequest } from "../types/auth";

function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    if (typeof payload === "string") {
      return res.status(401).json({ error: "Invalid token" });
    }

    const jwtPayload: JwtPayload = payload;

    if (typeof jwtPayload.sub !== "string") {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = {
      id: jwtPayload.sub,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default auth;
