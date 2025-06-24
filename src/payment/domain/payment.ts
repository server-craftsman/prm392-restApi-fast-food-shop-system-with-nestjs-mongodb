import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod } from '../payment-enum';

export class Payment {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ description: 'Order ID that this payment belongs to' })
  orderId: string;

  @ApiProperty({ description: 'User ID who made the payment' })
  userId: string;

  @ApiProperty({ description: 'Payment amount' })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method used' })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Unique transaction ID' })
  transactionId: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
  status: PaymentStatus;

  @ApiProperty({
    description: 'ZaloPay payment URL (for ZaloPay method)',
    required: false,
  })
  paymentUrl?: string;

  @ApiProperty({
    description: 'ZaloPay order ID (for ZaloPay method)',
    required: false,
  })
  zaloPayOrderId?: string;

  @ApiProperty({ description: 'Payment description or notes', required: false })
  description?: string;

  @ApiProperty({ description: 'Payment creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Payment update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Payment deletion timestamp', required: false })
  deletedAt?: Date;
}
