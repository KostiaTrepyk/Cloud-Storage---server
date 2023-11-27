import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm';

export class GetAllUsersDto {
  @ApiProperty({
    example: 'SharedWith',
    required: false,
    enum: ['SharedWith', 'Creation'],
  })
  @IsOptional()
  @IsIn(['SharedWith', 'Creation'])
  orderBy: 'SharedWith' | 'Creation';

  @ApiProperty({
    example: 'DESC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderValue: 'ASC' | 'DESC';

  @ApiProperty({ example: 0, minimum: 0, required: false })
  @Min(0)
  @IsOptional()
  @IsInt()
  offset: number;

  @ApiProperty({ example: 15, minimum: 10, maximum: 50, required: false })
  @Min(5)
  @Max(50)
  @IsOptional()
  @IsInt()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchByEmail: string;
}
