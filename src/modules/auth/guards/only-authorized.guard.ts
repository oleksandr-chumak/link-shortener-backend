import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InvalidTokenException } from '../exceptions';
import { AuthTokenService } from '../../token';

@Injectable()
export class OnlyAuthorizedGuard implements CanActivate {
  constructor(private readonly jwtService: AuthTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new InvalidTokenException();
    }
    try {
      const payload = await this.jwtService.verifyAccessToken(token);
      request['user'] = payload.id;
    } catch (err) {
      throw new InvalidTokenException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers['authorization'] || '';
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
