import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './domain/cart.schema';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Cart>): Promise<Cart> {
    return this.cartService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Cart>): Promise<Cart> {
    return this.cartService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.cartService.delete(id);
  }
}
