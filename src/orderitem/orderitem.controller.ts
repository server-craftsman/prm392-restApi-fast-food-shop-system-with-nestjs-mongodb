import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { OrderItemService } from './orderitem.service';
import { OrderItem } from './domain/orderitem.schema';

@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  findAll(): Promise<OrderItem[]> {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderItem> {
    return this.orderItemService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<OrderItem>): Promise<OrderItem> {
    return this.orderItemService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<OrderItem>,
  ): Promise<OrderItem> {
    return this.orderItemService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.orderItemService.delete(id);
  }
}
