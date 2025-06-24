import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../order-status.enum';

export class OrderItems {
  @ApiProperty({
    required: false,
    description: 'Product ID (optional for custom products)',
  })
  productId?: string;

  @ApiProperty({ description: 'Product name' })
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false, description: 'Custom notes for the product' })
  notes?: string;
}

export class Order {
  @ApiProperty()
  id: string;

  @ApiProperty()
  cartId: string;

  items: OrderItems[];

  @ApiProperty()
  total: number;

  @ApiProperty({ enum: OrderStatus })
  status: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({
    required: false,
    description: 'Additional notes for the order',
  })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
