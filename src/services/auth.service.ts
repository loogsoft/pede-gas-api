import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { UserEntity } from 'src/entities/user.entity';
import type { JwtPayload } from 'src/types/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    const isPasswordValid = await this.isPasswordValid(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inativo');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    return {
      token,
      role: user.role,
    };
  }

  private async isPasswordValid(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    const isBcryptHash = storedPassword.startsWith('$2');

    if (!isBcryptHash) {
      return password === storedPassword;
    }

    return bcrypt.compare(password, storedPassword);
  }
}
