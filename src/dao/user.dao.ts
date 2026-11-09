import User, { IUser } from "../models/user.model.js";
import Role, { IRole } from "../models/role.model.js";
import { UserResponseDTO } from "../dto/user.dto.js";

export const findAll = async (): Promise<IUser[]> => {
  return await User.find({}, { password: 0 })
    .populate({ path: "roles", model: Role })
    .lean()
    .exec();
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne({ email: email }, { password: 0 })
    .populate({ path: "roles", model: Role })
    .lean()
    .exec();
  return user;
};

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = await new User(data).save();
  return user;
};
