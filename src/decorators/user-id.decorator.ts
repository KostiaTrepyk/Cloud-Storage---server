import { ExecutionContext, HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator(
	(_: unknown, ctx: ExecutionContext): number => {
		const request = ctx.switchToHttp().getRequest();
		if (!request.user?.id)
			throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

		return Number(request.user.id);
	}
);
