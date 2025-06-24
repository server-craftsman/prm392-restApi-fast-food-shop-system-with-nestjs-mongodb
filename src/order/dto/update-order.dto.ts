import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  cartId?: string;

  // @ApiPropertyOptional({ type: String })
  // @IsMongoId()
  // @IsOptional()
  // userId?: string;
}
