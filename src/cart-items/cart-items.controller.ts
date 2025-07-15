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
  Query,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { Cart } from './domain/cart';
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
import {
  QueryCartDto,
  QueryMyCartDto,
  MyCartPaginationResponseDto,
} from './dto/query-cart.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResponseDto } from '../utils/dto/infinity-pagination-response.dto';

@ApiTags('Carts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'carts',
  version: '1',
})
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all carts (Admin only)' })
  @ApiOkResponse({
    description: 'Get all carts',
    type: [Cart],
  })
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryCartDto,
  ): Promise<InfinityPaginationResponseDto<Cart>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.cartItemsService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  // @Get('/me')
  // @ApiOperation({ summary: 'Get cart' })
  // @ApiOkResponse({
  //   description: 'Get cart',
  //   type: Cart,
  // })
  // @HttpCode(HttpStatus.OK)
  // getCart(@Request() req) {
  //   return this.cartItemsService.getCart(req.user.id);
  // }

  @Get('me')
  @ApiOperation({ summary: 'Get cart filtered & sorted & paginated' })
  @ApiOkResponse({
    description: 'Get cart filtered & sorted & paginated',
    type: MyCartPaginationResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async getMyCartPaginated(
    @Request() req,
    @Query() query: QueryMyCartDto,
  ): Promise<MyCartPaginationResponseDto> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return this.cartItemsService.getMyCartWithPagination({
      userId: req.user.id,
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @Get('me/count')
  @ApiOperation({ summary: 'Get total quantity of items in my cart' })
  @ApiOkResponse({
    description: 'Total quantity of items',
    schema: { type: 'number', example: 5 },
  })
  @HttpCode(HttpStatus.OK)
  async getMyCartItemCount(@Request() req): Promise<{ count: number }> {
    const count = await this.cartItemsService.countItems(req.user.id);
    return { count };
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
