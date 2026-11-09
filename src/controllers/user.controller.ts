import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userService.findUsers();
    // console.log("Result>>", result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// export const getOneByEmail = async(req: Request<{email:string}>, res: Response, next: NextFunction) => {
export const getOneByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const param = req.params.email;
    if (typeof param != "string") {
      console.log("NO EMAIL");
      throw new Error("Expected one email parameter");
    }
    const email: string = param;
    const result = await userService.findUserByEmail(email);
    console.log("BYEMAIL RESULT", result);
    if (!result)
      return res.status(404).json({ message: "User not found by email" });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
    console.log(">>>", data);

    const result = await userService.createUser(data);
    if (!result) {
      return res.status(404).json({ message: "user not created" });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
