import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import type { AuthenticatedUser } from 'src/types/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context) as
      boolean | Promise<boolean> | Observable<boolean>;
  }

  handleRequest<TUser = AuthenticatedUser>(
    error: unknown,
    user: TUser | false | null,
  ): TUser {
    if (error || !user) {
      throw error || new UnauthorizedException('Token invalido ou ausente');
    }

    return user;
  }
}
