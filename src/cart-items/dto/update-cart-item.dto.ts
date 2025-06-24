import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
