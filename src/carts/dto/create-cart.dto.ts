import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CartStatus } from '../enum/status.enum';

export class CreateCartDto {
  @ApiProperty({ type: String })
  cartNo: string;

  @ApiProperty({ type: String, enum: CartStatus, default: CartStatus.PENDING })
  @IsEnum(CartStatus)
  status: CartStatus;

  // @ApiProperty({ type: String })
  // @IsString()
  // userId: string;
}
