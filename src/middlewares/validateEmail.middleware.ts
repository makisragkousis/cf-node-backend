import { Request, Response, NextFunction } from "express";

export const validateEmail =
  (paramName = "email") =>
  (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (
      typeof value !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    next();
  };
