import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PointTransactionsService } from './pointTransactions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/guards/jwt-strategy.enum';
import { CreatePointTransactionDto } from './dto/create-pointTransaction.dto';
import { GetUser } from 'src/commons/get-user.decorator';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';

@Controller('points')
export class PointTransactionsController {
  constructor(
    private readonly pointTransactionsService: PointTransactionsService, //
  ) {}

  @UseGuards(JwtAuthGuard(JwtStrategy.ACCESS))
  @Post()
  createPointTransaction(
    @Body() createPointTransactionDto: CreatePointTransactionDto, //
    @GetUser() user: IGetUser,
  ) {
    return this.pointTransactionsService.create(
      createPointTransactionDto,
      user,
    );
  }
}
