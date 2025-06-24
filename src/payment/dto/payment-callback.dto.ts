import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentCallbackDto {
  @ApiProperty({ description: 'ZaloPay order ID' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Transaction ID from ZaloPay' })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiProperty({ description: 'Payment status code' })
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiProperty({ description: 'Payment amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Additional data', required: false })
  @IsOptional()
  @IsString()
  data?: string;
}
