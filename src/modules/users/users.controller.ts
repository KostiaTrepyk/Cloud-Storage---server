import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserType } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { UserEntity } from '../../entities/user.entity';
import { FilesStatistic } from 'src/modules/files/types/FilesStatistic';
import { UpdateUserDto } from './dto/update-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	async getUserData(
		@User() user: UserType
	): Promise<{ user: UserEntity; statistic: FilesStatistic }> {
		const response = await this.usersService.getUserDataWithStatistic(user);

		if (!response.user || !response.statistic)
			throw new HttpException(
				'Server error',
				HttpStatus.INTERNAL_SERVER_ERROR
			);

		return response;
	}

	@Get('allUsers')
	async getAllUsers(
		@User() user: UserType,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		dto: GetAllUsersDto
	): Promise<{
		count: number;
		users: UserEntity[];
	}> {
		return await this.usersService.getAllUsers(user, dto);
	}

	@Put('update')
	async updateUser(
		@User() user: UserType,
		@Body() dto: UpdateUserDto
	): Promise<boolean> {
		return await this.usersService.updateUser(user, dto);
	}

	@Delete('delete')
	async deleteUser(@User() user: UserType): Promise<boolean> {
		return await this.usersService.deleteUser(user);
	}
}
