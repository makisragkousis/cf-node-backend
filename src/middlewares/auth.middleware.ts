import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Missing or Invalid Authoriazation header" });
    return;
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json("Invalid Authorization format");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // req.user = payload
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
