import { IRoleDTO } from "../dto/role.dto.js";

export interface AuthPayloadDTO {
  username: string;
  email: string;
  roles: IRoleDTO[];
}
