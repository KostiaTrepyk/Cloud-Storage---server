import * as bcrypt from 'bcrypt';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser({ email, password }: LoginDto): Promise<UserEntity> {
		const user = await this.usersService.findByEmail(email, {
			password: true,
		});

		if (!user)
			throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);

		const isMatch = await bcrypt.compare(password, user.password);

		if (user && isMatch) {
			return user;
		}
	}

	async register(dto: RegistrationDto): Promise<{
		token: string;
	}> {
		try {
			const userData = await this.usersService.create(dto);

			return {
				token: this.jwtService.sign({ id: userData.id }),
			};
		} catch (error) {
			throw new ForbiddenException();
		}
	}

	async login(user: UserEntity): Promise<{
		token: string;
	}> {
		const payload = { id: user.id };

		return { token: this.jwtService.sign(payload) };
	}
}
