import { IRoleDTO } from "../dto/role.dto";

export interface AuthPayloadDTO {
  username: string;
  email: string;
  roles: IRoleDTO[]
}