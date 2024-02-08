import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from '../types/JwtTokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private usersService: UsersService,
		private configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT.SECRET_KEY'),
		});
	}

	async validate(payload: JwtTokenPayload) {
		const user = await this.usersService.getUserData(payload.id);

		if (!user) throw new UnauthorizedException();

		return user;
	}
}
