import * as bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';

import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { JwtTokenPayload } from './types/JwtTokenPayload';
import { UserType } from 'src/decorators/user.decorator';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async register(dto: RegistrationDto): Promise<{
		token: string;
	}> {
		const userData = await this.usersService.create(dto);

		return { token: this.createToken(userData) };
	}

	async login(user: UserType): Promise<{
		token: string;
	}> {
		return { token: this.createToken(user) };
	}

	async validateUser({
		email,
		password,
	}: LoginDto): Promise<JwtTokenPayload> {
		const user = await this.usersService.findByEmail(email, {
			id: true,
			fullName: true,
			email: true,
			createdAt: false,
			password: true,
		});

		if (!user)
			throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);

		const isMatch = await bcrypt.compare(password, user.password);

		if (user && isMatch) {
			const { password, ...rest } = user;
			return rest;
		}
	}

	private createToken(payload: JwtTokenPayload): string {
		return this.jwtService.sign(payload);
	}
}
