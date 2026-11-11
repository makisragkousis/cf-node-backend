import { IRoleDTO } from "../dto/role.dto.js";

export interface AuthPayload {
  username: string;
  email: string;
  roles: IRoleDTO[];
}
