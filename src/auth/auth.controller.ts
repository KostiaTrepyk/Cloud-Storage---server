import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /* FIX Types */
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loign(@Request() req): Promise<{
    token: string;
  }> {
    return await this.authService.login(req.user as UserEntity);
  }

  @Post('registration')
  async registration(@Body() dto: CreateUserDto): Promise<{
    token: string;
  }> {
    return await this.authService.register(dto);
  }
}
