import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Put,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { UserEntity } from './entities/user.entity';
import { FilesStatistic } from 'src/files/types/FilesStatistic';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	async getUserData(
		@UserId() userId: number
	): Promise<{ user: UserEntity; statistic: FilesStatistic }> {
		const response = await this.usersService.getUserDataWithStatistic(
			userId
		);

		if (!response.user || !response.statistic)
			throw new HttpException(
				'Server error',
				HttpStatus.INTERNAL_SERVER_ERROR
			);

		return response;
	}

	@Get('allUsers')
	async getAllUsers(
		@UserId() userId: number,
		@Query(
			new ValidationPipe({
				transform: true,
				transformOptions: { enableImplicitConversion: true },
				forbidNonWhitelisted: true,
			})
		)
		query?: GetAllUsersDto
	): Promise<{
		count: number;
		users: UserEntity[];
	}> {
		return await this.usersService.getAllUsers({ ...query, userId });
	}

	@Put('update')
	async updateUser(
		@UserId() userId: number,
		@Body() dto: UpdateUserDto
	): Promise<boolean> {
		return await this.usersService.updateUser({ userId, ...dto });
	}

	@Delete('delete')
	async deleteUser(@UserId() userId: number): Promise<boolean> {
		return await this.usersService.deleteUser(userId);
	}
}
