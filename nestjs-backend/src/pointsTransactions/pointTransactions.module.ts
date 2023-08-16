import { Module } from '@nestjs/common';
import { PointTransactionsController } from './pointTransactions.controller';
import { PointTransactionsService } from './pointTransactions.service';
import { SequelizeModule } from '@nestjs/sequelize';
import PointTransaction from './model/pointTransaction.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PointTransaction, //
    ]),
    UsersModule,
  ],
  controllers: [
    PointTransactionsController, //
  ],
  providers: [
    PointTransactionsService, //
  ],
})
export class PointTransactionsModule {}
