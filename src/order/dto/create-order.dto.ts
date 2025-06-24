import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  cartId: string;

  // @ApiProperty({ type: String })
  // @IsMongoId()
  // userId: string;
}
