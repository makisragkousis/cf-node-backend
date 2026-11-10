// import User, {IUser} from '../models/user.model';
// Προσθήκη για ρόλο schema
import Role, { IRole } from "../models/role.model.js";
import { Types } from "mongoose";
import * as userDao from "../dao/user.dao.js";
import { CreateUserDTO, UpdateUserDTO } from "../dto/user.dto.js";
import { IUser } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "5");

// export const findUsers = async():Promise<IUser[]> => {
export const findUsers = async () => {
  // Προσθήκη στο populate για ρόλο
  // const users = await User.find().populate("roles").lean().exec();
  // const users = await User.find().populate({ path: "roles", model: Role }).lean().exec();
  const users = await userDao.findAll();
  console.log(">>>>>>>", users);
  return users;
};

export const findUserByEmail = async (email: string) => {
  const user = await userDao.findByEmail(email);
  if (user) {
    return user;
  }
};

export const createUser = async (payload: Partial<CreateUserDTO>) => {
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }

  let roleIds: Types.ObjectId[] = [];
  if (payload.roles && payload.roles.length > 0) {
    roleIds = payload.roles.map((id) => new Types.ObjectId(id));
  } else {
    let reader: IRole | null = await Role.findOne({ role: "READER" });
    if (!reader) {
      reader = await Role.create({
        role: "READER",
        description: "Default Role",
        active: true,
      });
    }
    roleIds = [reader._id];
  }

  const user = await userDao.createUser({
    ...payload,
    roles: roleIds,
  });

  if (user) {
    return user;
  }
};

export const updateUser = async (username: string, payload: UpdateUserDTO) => {
  const updateData: Partial<IUser> = {};

  if (payload.firstname !== undefined) updateData.firstname = payload.firstname;
  if (payload.lastname !== undefined) updateData.lastname = payload.lastname;
  if (payload.email !== undefined) updateData.email = payload.email;
  if (payload.address !== undefined) updateData.address = payload.address;
  if (payload.phone !== undefined) updateData.phone = payload.phone;

  if (payload.password) {
    updateData.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
  }

  if (payload.roles) {
    updateData.roles = payload.roles.map((id) => new Types.ObjectId(id));
  }

  const user = await userDao.updateUser(username, updateData);
  return user;
};

export const deleteUser = async (username: string) => {
  const user = await userDao.deleteUser(username);
  return user;
};
