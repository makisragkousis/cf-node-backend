import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import { UpdateUserDTO } from "../dto/user.dto.js";

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

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const param = req.params.username;
    if (typeof param != "string") {
      throw new Error("Expected one username parameter");
    }
    const username: string = param;
    const data: UpdateUserDTO = req.body;
    const result = await userService.updateUser(username, data);
    if (!result) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const param = req.params.username;
    if (typeof param != "string") {
      throw new Error("Expected one username as parameter");
    }
    const username: string = param;
    const result = await userService.deleteUser(username);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
