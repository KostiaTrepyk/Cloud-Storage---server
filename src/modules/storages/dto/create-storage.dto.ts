import { ApiProperty } from "@nestjs/swagger";

export class CreateStorageDto {

    @ApiProperty()
    name: string
}
