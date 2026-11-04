import User, { IUser } from "../models/user.model";

export const findUsers = async (): Promise<IUser[]> => {
  const users = await User.find().populate("roles").lean().exec();
  return users;
};
