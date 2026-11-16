import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthPayloadDTO } from "../dto/auth.dto.js";
import { IRoleDTO } from "../dto/role.dto.js";

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

    const payload = jwt.verify(token, JWT_SECRET) as AuthPayloadDTO;

    console.log(">>>", payload);

    const checkAdminRole = payload.roles.some(
      (r: IRoleDTO) => r.role === "ADMIN" && r.active,
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
