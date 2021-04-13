import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class IsServerGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest() as Request;

    console.log(req.headers);
    if (req.headers['access-token'] === this.configService.get('SECRET')) {
      return true;
    }

    return false;
  }
}
