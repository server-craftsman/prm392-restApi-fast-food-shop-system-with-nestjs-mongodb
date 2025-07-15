import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './domain/store.schema';
import { CreateStoreDto, UpdateStoreDto, QueryStoreDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiBody,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@ApiTags('Stores')
@Controller({
  path: 'stores',
  version: '1',
})
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all stores with filtering, pagination and location search',
  })
  @ApiOkResponse({ description: 'List of stores', type: [Store] })
  findAll(@Query() query: QueryStoreDto): Promise<Store[]> {
    return this.storeService.findAll(query);
  }

  @Get('nearby/:latitude/:longitude')
  @ApiOperation({ summary: 'Find stores near a location' })
  @ApiParam({
    name: 'latitude',
    description: 'Latitude coordinate',
    example: '10.7769',
  })
  @ApiParam({
    name: 'longitude',
    description: 'Longitude coordinate',
    example: '106.7009',
  })
  @ApiOkResponse({ description: 'Nearby stores', type: [Store] })
  findNearby(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
    @Query('radius') radius: number = 10,
    @Query('limit') limit: number = 20,
  ): Promise<Store[]> {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException(
        'Invalid latitude or longitude coordinates',
      );
    }

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }

    if (radius <= 0 || radius > 100) {
      throw new BadRequestException('Radius must be between 0.1 and 100 km');
    }

    return this.storeService.findNearby(lat, lng, radius, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiOkResponse({ description: 'Store details', type: Store })
  findOne(@Param('id') id: string): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create store' })
  @ApiBody({ description: 'Store payload', type: CreateStoreDto })
  @ApiCreatedResponse({ description: 'Store created', type: Store })
  create(@Body() data: CreateStoreDto): Promise<Store> {
    return this.storeService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiBody({ description: 'Store updates', type: UpdateStoreDto })
  @ApiOkResponse({ description: 'Updated store', type: Store })
  update(
    @Param('id') id: string,
    @Body() data: UpdateStoreDto,
  ): Promise<Store> {
    return this.storeService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiNoContentResponse({ description: 'Store deleted' })
  delete(@Param('id') id: string): Promise<void> {
    return this.storeService.delete(id);
  }
}
