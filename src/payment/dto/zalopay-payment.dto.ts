import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ZaloPaymentDto {
  @ApiProperty({ description: 'Order ID to make payment for' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Payment description or notes', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Return URL after payment', required: false })
  @IsOptional()
  @IsString()
  returnUrl?: string;
}
