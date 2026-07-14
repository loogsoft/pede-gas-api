import { UserRole } from "../enums/user-role.enum";

export class LoginResponseDto {
  token: string;
  role: UserRole;
}
