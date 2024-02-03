import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { AddToFavouriteDto } from './dto/addToFavourite.dto';
import { RemoveFromFavouriteDto } from './dto/removeFromFavourite.dto';
import { FileEntity } from '../../../modules/storages/entities/file.entity';
import { UserId } from 'src/decorators/user-id.decorator';

@ApiTags('Favourite files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files/favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  async findAll(
    @UserId() userId: number,
  ): Promise<{ files: FileEntity[]; count: number }> {
    return await this.favouriteService.findAll(userId);
  }

  @Put('add')
  async addToFavourite(
    @UserId() userId: number,
    @Body() dto: AddToFavouriteDto,
  ) {
    return await this.favouriteService.addToFavourite(userId, dto);
  }

  @Put('remove')
  async removeFromFavourite(
    @UserId() userId: number,
    @Body() dto: RemoveFromFavouriteDto,
  ) {
    return await this.favouriteService.removeFromFavourite(userId, dto);
  }
}
