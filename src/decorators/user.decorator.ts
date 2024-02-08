import { ExecutionContext, HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';
import { type UserEntity } from 'src/entities/user.entity';
import { JwtTokenPayload } from 'src/modules/auth/types/JwtTokenPayload';

export const User = createParamDecorator(
	(_: unknown, ctx: ExecutionContext): UserEntity => {
		const request = ctx.switchToHttp().getRequest();
		if (!request.user?.id)
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

		return request.user as UserEntity;
	}
);

export type UserType = JwtTokenPayload