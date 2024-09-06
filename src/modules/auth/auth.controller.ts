import { Body, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { User, UserType } from 'src/decorators/user.decorator';
import { Throttle } from '@nestjs/throttler';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Throttle({ default: { limit: 2000000, ttl: 300_000 } })
	@ApiBody({ type: LoginDto })
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async loign(@User() user: UserType): Promise<{ token: string }> {
		return await this.authService.login(user);
	}

	@Throttle({ default: { limit: 30000000, ttl: 7_200_000 } })
	@Post('registration')
	async registration(@Body() dto: RegistrationDto): Promise<{
		token: string;
	}> {
		return await this.authService.register(dto);
	}
}
