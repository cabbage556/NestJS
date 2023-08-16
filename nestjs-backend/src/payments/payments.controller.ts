import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService, //
  ) {}

  @Post()
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto, //
  ) {
    return this.paymentsService.create(createPaymentDto);

    // Read Uncommitted - Dirty Read(PostgreSQL에서 확인x)
    // return this.paymentsService.createWithReadUncommitedLevel(createPaymentDto);

    // Read Committed - Non repeatable Read
    // return this.paymentsService.createWithReadCommitedLevel(createPaymentDto);
  }

  @Get()
  getPayments() {
    // Read Uncommitted - Dirty Read(PostgreSQL에서 확인x)
    // return this.paymentsService.getPaymentsWithReadUncommittedLevel();

    // Read Committed - Non repeatable Read
    // return this.paymentsService.getPaymentsWithReadCommittedLevel();

    // Read Committed - Phantom Read
    return this.paymentsService.getPaymentsWithReadCommittedLevelRepeatedly();
  }
}
