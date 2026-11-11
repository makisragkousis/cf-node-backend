import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ token: result.token, user: { username: result.user.username } });
  } catch (err) {
    next(err);
  }
};
