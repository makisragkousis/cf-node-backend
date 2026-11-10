import User, { IUser } from "../models/user.model.js";
import Role, { IRole } from "../models/role.model.js";
import { UserResponseDTO } from "../dto/user.dto.js";
import { IRoleDTO } from "../dto/role.dto.js";

export const findAll = async (): Promise<UserResponseDTO[]> => {
  return await User.find({}, { password: 0 })
    .populate<{ roles: IRoleDTO[] }>({ path: "roles", model: Role })
    .lean()
    .exec();
};

export const findByEmail = async (
  email: string,
): Promise<UserResponseDTO | null> => {
  const user = await User.findOne({ email: email }, { password: 0 })
    .populate<{ roles: IRoleDTO[] }>({ path: "roles", model: Role })
    .lean()
    .exec();
  return user;
};

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = await new User(data).save();
  return user;
};

export const updateUser = async (
  username: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ username: username }, payload)
    .populate({ path: "roles", model: Role })
    .lean()
    .exec();
};

export const deleteUser = async (username: string): Promise<boolean> => {
  const result = await User.findOneAndDelete({ username }).exec();
  return !!result;
};
