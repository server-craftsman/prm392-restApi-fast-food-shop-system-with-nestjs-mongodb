import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CartItemService } from './cartitem.service';
import { CartItem } from './domain/cartitem.schema';

@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get()
  findAll(): Promise<CartItem[]> {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CartItem> {
    return this.cartItemService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<CartItem>): Promise<CartItem> {
    return this.cartItemService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<CartItem>,
  ): Promise<CartItem> {
    return this.cartItemService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.cartItemService.delete(id);
  }
}
