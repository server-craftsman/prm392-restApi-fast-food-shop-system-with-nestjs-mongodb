import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : undefined;

export class Cart {
  @ApiProperty({ type: idType })
  id: string | undefined;

  @ApiProperty({ type: String })
  cartNo: string;

  @ApiProperty({
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'cancelled';

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: Date, required: false })
  createdAt?: Date;

  @ApiProperty({ type: Date, required: false })
  updatedAt?: Date;

  @ApiProperty({ type: Date, required: false })
  deletedAt?: Date;
}
