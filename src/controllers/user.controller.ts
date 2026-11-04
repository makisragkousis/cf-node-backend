import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userService.findUsers();
    console.log("Result>>", result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
