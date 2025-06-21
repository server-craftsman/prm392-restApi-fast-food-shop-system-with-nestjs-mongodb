import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './domain/category';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiOperation,
} from '@nestjs/swagger';
import { NullableType } from '../utils/types/nullable.type';
// pagination
import { infinityPagination } from '../utils/infinity-pagination';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';

@ApiTags('Categories')
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse<Category>,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryCategoryDto,
  ): Promise<InfinityPaginationResponseDto<Category>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.categoryService.findManyWithPagination({
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
  @ApiOkResponse({ type: Category })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Category>> {
    return this.categoryService.findById(id);
  }

  @Get('name/:name')
  @ApiExcludeEndpoint()
  @ApiOkResponse({ type: Category })
  @HttpCode(HttpStatus.OK)
  findByName(@Param('name') name: string): Promise<NullableType<Category>> {
    return this.categoryService.findByCategoryName(name);
  }

  @ApiOperation({
    summary: 'Create a new category (Admin only)',
    description: 'Create a new category (Admin only)',
  })
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Category, description: 'The created category' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(data);
  }

  @ApiOperation({
    summary: 'Update a existing category (Admin only)',
    description: 'Update a existing category (Admin only)',
  })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Category })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a existing category (Admin only)',
    description: 'Delete a existing category (Admin only)',
  })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete a existing category (Admin only)' })
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
