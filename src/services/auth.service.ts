import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { AuthPayloadDTO } from '../dto/auth.dto';
import { IRoleDTO } from '../dto/role.dto';
import Role from '../models/role.model';
import { verifyGoogleIdToken } from '../utils/googleVerify';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES = '1h';

export const login = async(username:string, password:string) =>{
  const user = await User.findOne({username})
   .populate<{roles:IRoleDTO[]}>({path: "roles", model: Role})
  if (!user) return null;
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  
  const payload: AuthPayloadDTO = {
    username: user.username, 
    email:user.email, 
    roles: user.roles
  }
  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES});
  return {user, token} 
}

export const googleLogin = async(idToken:string) => {
  try {
    if (!idToken) {
      return {status: false,message: 'Missing Token'}
    }

    const googleUser = await verifyGoogleIdToken(idToken);
    if (!googleUser.email_verified) {
      return {status: false, message: "email not verified"}
    }

    if (!googleUser.email){
      return {status: false, message: "Google account has no email"}
    }

    // If user do not exist in database, save user to database
    let user = await User.findOne({emal: googleUser.email});
    if (!user) {
      console.log("user not exist", googleUser.email)
    }

    const token = jwt.sign(
      {
        username: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        photo: googleUser.picture,
        roles: [{}]
      },
      process.env.JWT_SECRET as string,
      {expiresIn: '1h'}
    )

    // console.log("GOOGLE USER>>", googleUser);
    return {status:true, token: token}
  } catch (err){
    return {status:false, message:err}
  }
}