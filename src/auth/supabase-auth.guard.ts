import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { IS_PUBLIC_KEY } from './public.decorator.js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    private readonly issuer: string;
    private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

    constructor(private readonly reflector: Reflector, config: ConfigService) {
        this.issuer = `${config.getOrThrow<string>('SUPABASE_URL')}/auth/v1`;
        this.jwks = createRemoteJWKSet(new URL(`${this.issuer}/.well-known/jwks.json`));
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ])
        if (isPublic) return true;

        const req = ctx.switchToHttp().getRequest();
        const [type, token] = (req.headers.authorization ?? '').split(' ');
        if (type !== 'Bearer' || !token) throw new UnauthorizedException('Missing or invalid authorization header');

        try {
            const { payload } = await jwtVerify(token, this.jwks, {
                issuer: this.issuer,
                audience: 'authenticated',
            });
            req.user = { id: payload.sub };
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}