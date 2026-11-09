import { StringExpressionOperatorReturningBoolean } from "mongoose";
import { IRole } from "../models/role.model.js";
import { IPhone } from "../models/user.model.js";

export interface IPhoneDTO {
  type: string;
  number: string;
}

export interface UserResponseDTO {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  address: {
    area: string;
    street: string;
    number: string;
    po: string;
    municipality: string;
  };
  phone: IPhoneDTO[];
  // phone: IPhone[]
  roles: string[];
  // roles: IRole;
}

export interface CreateUserDTO {
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  email: string;
  address?: {
    area?: string;
    street?: string;
    number?: string;
    po?: string;
    municipality?: string;
  };
  phone?: IPhoneDTO[];
  roles?: string[];
}
