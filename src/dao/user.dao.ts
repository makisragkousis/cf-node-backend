import User, {IUser} from '../models/user.model';
import Role, {IRole} from '../models/role.model';
import { UserResponseDTO } from '../dto/user.dto';
import { IRoleDTO } from '../dto/role.dto';

export const findAll = async():Promise<UserResponseDTO[]> =>{
  return await User.find({},{"password":0})
    .populate<{roles:IRoleDTO[]}>({ path: "roles", model: Role })
    .lean()
    .exec();
}

export const findByEmail = async(email:string): Promise<UserResponseDTO | null> =>{
  const user = await User.findOne({email:email},{"password":0})
    .populate<{roles:IRoleDTO[]}>({path: "roles", model: Role})
    .lean()
    .exec(); 
  return user 
}

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = await new User(data).save()
  return user;
}

export const updateUser = async(username: string, payload: Partial<IUser>): Promise<IUser | null> => {
  return await User.findOneAndUpdate({username:username}, payload)
    .populate({path:"roles", model:Role})
    .lean()
    .exec()
}

export const deleteUser = async(username: string): Promise<boolean> => {
  const result = await User.findOneAndDelete({username}).exec();
  return !!result
}

export const findLastInsertedUser = async() => {
  try {
    const result = await User.find({}).sort({_id:-1}).limit(1)
    console.log("Last inserted user", result[0]?.username);
    return result[0];
  } catch (err) {
    console.log("Problem in last inserted user", err);
  }
}