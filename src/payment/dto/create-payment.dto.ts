import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../payment-enum';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID to make payment for' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Payment amount', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Payment description or notes', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
