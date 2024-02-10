import { Body, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { User, UserType } from 'src/decorators/user.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiBody({ type: LoginDto })
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async loign(@User() user: UserType): Promise<{ token: string }> {
		return await this.authService.login(user);
	}

	@Post('registration')
	async registration(@Body() dto: RegistrationDto): Promise<{
		token: string;
	}> {
		return await this.authService.register(dto);
	}
}
