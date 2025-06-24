import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { Cart } from '../carts/domain/cart';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'carts',
  version: '1',
})
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get cart' })
  @ApiOkResponse({
    description: 'Get cart',
    type: Cart,
  })
  @HttpCode(HttpStatus.OK)
  getCart(@Request() req) {
    return this.cartItemsService.getCart(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by id' })
  @ApiOkResponse({
    description: 'Get cart by id',
    type: Cart,
  })
  @HttpCode(HttpStatus.OK)
  getCartById(@Param('id') id: string) {
    return this.cartItemsService.getCartById(id);
  }

  @Post('/add/item')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiCreatedResponse({
    description: 'Add item to cart',
    type: Cart,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  addItemToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartItemsService.addItemToCart(req.user.id, addToCartDto);
  }

  @Put(':productId')
  @ApiOperation({ summary: 'Update cart item' })
  @ApiOkResponse({
    description: 'Update cart item',
    type: Cart,
  })
  @HttpCode(HttpStatus.OK)
  updateCartItem(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.updateCartItem(
      req.user.id,
      productId,
      updateCartItemDto,
    );
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiOkResponse({
    description: 'Remove item from cart',
    type: Cart,
  })
  @HttpCode(HttpStatus.OK)
  removeItemFromCart(@Request() req, @Param('productId') productId: string) {
    return this.cartItemsService.removeItemFromCart(req.user.id, productId);
  }

  @Delete('/clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiOkResponse({
    description: 'Clear cart',
    type: Cart,
  })
  @HttpCode(HttpStatus.OK)
  clearCart(@Request() req) {
    return this.cartItemsService.clearCart(req.user.id);
  }
}
