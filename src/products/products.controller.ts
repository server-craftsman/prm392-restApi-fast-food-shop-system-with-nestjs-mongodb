import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './domain/product';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { NullableType } from '../utils/types/nullable.type';

// pagination
import { infinityPagination } from '../utils/infinity-pagination';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';


@ApiTags('Products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @ApiOkResponse({
    description: 'List all products with optional filters, sorting, and pagination',
    type: InfinityPaginationResponse<Product>,
  })
  async findAll(
    @Query() query: QueryProductDto,
  ): Promise<InfinityPaginationResponseDto<Product>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.productService.findManyWithPagination({
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

  @Get(':id')
  @ApiOkResponse({
    description: 'Get a product by its ID',
    type: Product,
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string): Promise<NullableType<Product>> {
    return this.productService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product',
  })
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Create a new product',
    type: Product,
  })
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateProductDto): Promise<Product> {
    return this.productService.create(data);
  }

  @ApiOperation({
    summary: 'Update an existing product',
    description: 'Update an existing product by its ID',
  })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update an existing product',
    type: Product,
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a product',
    description: 'Delete a product by its ID',
  })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete a product by its ID',
    type: undefined,
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.productService.delete(id);
  }
}
