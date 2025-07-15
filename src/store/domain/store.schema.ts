import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @ApiProperty({
    description: 'Store name',
    example: 'FastFood Downtown',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Store address',
    example: '123 Main Street, District 1, Ho Chi Minh City',
  })
  @Prop({ required: true })
  address: string;

  @ApiProperty({
    description: 'Store latitude coordinate',
    example: 10.7769,
  })
  @Prop({ required: true })
  latitude: number;

  @ApiProperty({
    description: 'Store longitude coordinate',
    example: 106.7009,
  })
  @Prop({ required: true })
  longitude: number;

  @ApiProperty({
    description: 'Store phone number',
    example: '+84901234567',
  })
  @Prop({ required: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'GeoJSON location for geospatial queries',
    example: {
      type: 'Point',
      coordinates: [106.7009, 10.7769],
    },
    required: false,
  })
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: [Number],
  })
  location?: {
    type: string;
    coordinates: [number, number];
  };
}

export const StoreSchema = SchemaFactory.createForClass(Store);

// Create geospatial index after schema creation
StoreSchema.index({ location: '2dsphere' });

// Pre-save middleware to automatically set location from latitude/longitude
StoreSchema.pre('save', function (next) {
  if (this.latitude && this.longitude) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude],
    };
  }
  next();
});

// Pre-update middleware for findOneAndUpdate
StoreSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any;
  if (update.latitude && update.longitude) {
    update.location = {
      type: 'Point',
      coordinates: [update.longitude, update.latitude],
    };
  }
  next();
});
