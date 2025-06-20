import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('cash')
  payByCash(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.payByCash(createPaymentDto);
  }

  @Post('pay_os')
  payByPayOs(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.payByPayOs(createPaymentDto);
  }
}
