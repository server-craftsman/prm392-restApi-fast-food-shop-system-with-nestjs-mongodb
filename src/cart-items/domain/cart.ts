import { ApiProperty } from '@nestjs/swagger';

export class CartItem {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;
}

export class Cart {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: [CartItem] })
  items: CartItem[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
