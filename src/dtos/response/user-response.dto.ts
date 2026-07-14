import { UserRole } from 'src/dtos/enums/user-role.enum';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
