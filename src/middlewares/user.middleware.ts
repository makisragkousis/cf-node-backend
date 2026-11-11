import { Request, Response, NextFunction } from "express";
import { IRole } from "../models/role.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
// import { AuthPayload } from "../models/auth.model";
dotenv.config();

interface AuthPayload extends JwtPayload {
  username: string;
  email: string;
  roles: IRole[];
}

const JWT_SECRET = process.env.JWT_SECRET || "";

export const hasAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    const token = header?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid Authorization" });
    }

    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;

    console.log(">>>", payload);

    const checkAdminRole = payload.roles.some(
      (r: IRole) => r.role === "ADMIN" && r.active,
    );
    console.log("CheckAdminRole>>>", checkAdminRole);
    if (!checkAdminRole) {
      return res
        .status(403)
        .json({ message: "Forbitten: Insufficiemt permisions" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Permisions" });
  }
};
