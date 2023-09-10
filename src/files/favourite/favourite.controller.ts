import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AddToFavouriteDto } from './dto/addToFavourite.dto';
import { RemoveFromFavouriteDto } from './dto/removeFromFavourite.dto';
import { FileEntity } from '../entities/file.entity';

@ApiTags('Favourite files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files/favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  async findAll(): Promise<FileEntity[]> {
    return await this.favouriteService.findAll();
  }

  @Put('add')
  async addToFavourite(@Body() dto: AddToFavouriteDto) {
    return await this.favouriteService.addToFavourite(dto);
  }

  @Put('remove')
  async removeFromFavourite(@Body() dto: RemoveFromFavouriteDto) {
    return await this.favouriteService.removeFromFavourite(dto);
  }
}
