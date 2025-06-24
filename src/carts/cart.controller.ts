import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { CartsService } from './cart.service';
import { Cart } from './domain/cart';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
// import { Roles } from '../roles/roles.decorator';
// import { RoleEnum } from '../roles/roles.enum';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() request, @Body() data: CreateCartDto): Promise<Cart> {
    const user = request.user as JwtPayloadType;
    return this.cartService.create(user.id as string, data);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCartDto,
  ): Promise<Cart> {
    return this.cartService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.cartService.delete(id);
  }
}
