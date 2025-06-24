import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
// import { CreatePaymentDto } from './dto/create-payment.dto';
import { ZaloPaymentDto } from './dto/zalopay-payment.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { QueryPaymentDto, QueryMyPaymentDto } from './dto/query-payment.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Payment } from './domain/payment';
import { PaymentStatus } from './payment-enum';
// format pagination
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Payments')
@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @ApiOperation({
  //   summary: 'Get all payments (Admin only)',
  //   description: 'Retrieve all payments in the system',
  // })
  // @Get()
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(RoleEnum.admin)
  // @ApiBearerAuth()
  // @ApiResponse({
  //   status: 200,
  //   description: 'List of all payments',
  //   type: [Payment],
  // })
  // @HttpCode(HttpStatus.OK)
  // async getAllPayments(): Promise<Payment[]> {
  //   return this.paymentService.findAll();
  // }

  @ApiOperation({
    summary: 'Get payments with pagination and filters (Admin only)',
    description:
      'Retrieve payments with pagination, filtering, and sorting options',
  })
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Paginated list of payments',
    type: InfinityPaginationResponse(Payment),
  })
  @HttpCode(HttpStatus.OK)
  async getPaymentsWithPagination(
    @Query() query: QueryPaymentDto,
  ): Promise<InfinityPaginationResponseDto<Payment>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const payments = await this.paymentService.findManyWithPagination({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(payments, { page, limit });
  }

  @ApiOperation({
    summary: 'Get my payments with pagination',
    description:
      'Retrieve payments made by the authenticated user with pagination, filtering, and sorting',
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Filtered & sorted & paginated user payments',
    type: InfinityPaginationResponse(Payment),
  })
  @HttpCode(HttpStatus.OK)
  async getMyPaymentsWithPagination(
    @Request() req,
    @Query() query: QueryMyPaymentDto,
  ): Promise<InfinityPaginationResponseDto<Payment>> {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const payments = await this.paymentService.findByUserIdWithPagination({
      userId: req.user.id,
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(payments, { page, limit });
  }

  @ApiOperation({
    summary: 'Get payments by order ID',
    description: 'Retrieve all payments for a specific order',
  })
  @Get('order/:orderId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Payments for the order',
    type: [Payment],
  })
  @HttpCode(HttpStatus.OK)
  async getPaymentsByOrder(
    @Param('orderId') orderId: string,
  ): Promise<Payment[]> {
    return this.paymentService.findByOrderId(orderId);
  }

  @ApiOperation({
    summary: 'Get payment by ID',
    description: 'Retrieve a specific payment by its ID',
  })
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment details',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @HttpCode(HttpStatus.OK)
  async getPayment(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create cash payment',
    description: 'Process a cash payment for an order',
  })
  @Post('cash/:orderId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'orderId', description: 'Order ID to pay for' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Payment description',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cash payment processed successfully',
    type: Payment,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order or payment already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async payByCash(
    @Param('orderId') orderId: string,
    @Body() body: { description?: string },
    @Request() req,
  ): Promise<Payment> {
    return this.paymentService.payByCash(
      req.user.id,
      orderId,
      body.description,
    );
  }

  @ApiOperation({
    summary: 'Create ZaloPay payment',
    description: 'Initiate a ZaloPay payment for an order',
  })
  @Post('zalopay')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiBody({ type: ZaloPaymentDto })
  @ApiResponse({
    status: 201,
    description: 'ZaloPay payment URL created successfully',
    schema: {
      type: 'object',
      properties: {
        paymentUrl: {
          type: 'string',
          description: 'ZaloPay payment URL',
        },
        payment: {
          $ref: '#/components/schemas/Payment',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order or payment already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async payByZaloPay(
    @Body() zaloPaymentDto: ZaloPaymentDto,
    @Request() req,
  ): Promise<{ paymentUrl: string; payment: Payment }> {
    return this.paymentService.payByZaloPay(req.user.id, zaloPaymentDto);
  }

  @ApiOperation({
    summary: 'ZaloPay payment callback',
    description: 'Handle ZaloPay payment callback (webhook)',
  })
  @Post('zalopay/callback')
  @ApiBody({ type: PaymentCallbackDto })
  @ApiResponse({
    status: 200,
    description: 'Callback processed successfully',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @HttpCode(HttpStatus.OK)
  async handleZaloPayCallback(
    @Body() callbackDto: PaymentCallbackDto,
  ): Promise<Payment> {
    return this.paymentService.handleZaloPayCallback(callbackDto);
  }

  @ApiOperation({
    summary: 'Update payment status',
    description: 'Update the status of a payment (Admin only)',
  })
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(PaymentStatus),
          description: 'New payment status',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @HttpCode(HttpStatus.OK)
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: PaymentStatus },
  ): Promise<Payment> {
    return this.paymentService.updatePaymentStatus(id, body.status);
  }

  @ApiOperation({
    summary: 'Cancel payment',
    description: 'Cancel a pending payment',
  })
  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment cancelled successfully',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @HttpCode(HttpStatus.OK)
  async cancelPayment(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.cancelPayment(id);
  }
}
