import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CartStatus } from '../enum/status.enum';

export class UpdateCartDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  cartNo?: string;

  @ApiPropertyOptional({ type: String, enum: CartStatus })
  @IsOptional()
  @IsEnum(CartStatus)
  status?: CartStatus;

  // @ApiPropertyOptional({ type: String })
  // @IsOptional()
  // @IsString()
  // userId?: string;
}
