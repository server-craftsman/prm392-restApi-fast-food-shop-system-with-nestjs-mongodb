import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { Order } from './domain/order';
import { CreateCustomOrderDto } from './dto/create-custom-order.dto';
import { CreateCustomOrderFromCartDto } from './dto/create-custom-order-from-cart.dto';

// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
// import { QueryOrderDto } from './dto/query-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'orders',
  version: '1',
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiOkResponse({
    description: 'The orders have been successfully retrieved.',
    type: [Order],
  })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.admin)
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all orders for the current user' })
  myOrders(@Req() req): Promise<Order[]> {
    return this.orderService.myOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Req() req, @Body() data: CreateOrderDto): Promise<Order> {
  //   return this.orderService.create(req.user.id, data);
  // }

  @Post('custom')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create custom order with custom products' })
  @ApiCreatedResponse({
    description: 'The custom order has been successfully created.',
    type: Order,
  })
  createCustomOrder(
    @Req() req,
    @Body() data: CreateCustomOrderDto,
  ): Promise<Order> {
    return this.orderService.createCustomOrder(req.user.id, data);
  }

  // @Post('from-cart')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ summary: 'Create order from cart' })
  // @ApiCreatedResponse({
  //   description: 'The order has been successfully created.',
  //   type: Order,
  // })
  // @HttpCode(HttpStatus.CREATED)
  // createFromCart(@Req() req) {
  //   return this.orderService.createFromCart(req.user.id);
  // }

  @Post('from-cart/custom')
  @ApiOperation({
    summary: 'Create custom order from cart with additional custom products',
  })
  @ApiCreatedResponse({
    description: 'The custom order has been successfully created from cart.',
    type: Order,
  })
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  createCustomOrderFromCart(
    @Req() req,
    @Body() data: CreateCustomOrderFromCartDto,
  ): Promise<Order> {
    return this.orderService.createCustomOrderFromCart(req.user.id, data);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cancel order (Order must be in PENDING status)' })
  @ApiCreatedResponse({
    description: 'The order has been cancelled.',
    type: Order,
  })
  @HttpCode(HttpStatus.OK)
  cancelOrder(@Req() req, @Param('id') id: string): Promise<Order> {
    return this.orderService.cancelOrder(req.user.id, id);
  }
}
