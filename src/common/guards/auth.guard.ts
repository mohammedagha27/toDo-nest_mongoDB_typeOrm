import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verifyToken } from 'src/common/utils';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (!authorization) return false;

    const decoded = verifyToken(authorization, process.env.SECRET_KEY);
    if (!decoded) {
      return false;
    }

    const dbUser = await this.userService.findUserById(decoded.user_id);

    if (!dbUser) {
      return false;
    }

    request.user = dbUser;
    return true;
  }
}
