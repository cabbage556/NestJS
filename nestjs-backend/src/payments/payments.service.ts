import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Payment from './model/payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment, //
    private readonly sequelize: Sequelize,
  ) {}

  create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentModel.create({ ...createPaymentDto });
  }

  // 트랜잭션 격리 수준: Read Uncommitted
  async createWithReadUncommitedLevel(
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const readUncommitedLevel = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });

    try {
      const payment = await this.paymentModel.create(
        { ...createPaymentDto },
        { transaction: readUncommitedLevel },
      );

      // 10초 뒤 트랜잭션 롤백
      setTimeout(async () => {
        await readUncommitedLevel.rollback();
      }, 10000);

      // await readUncommitedLevel.commit();
      return payment;
    } catch (error) {
      await readUncommitedLevel.rollback();
      throw new InternalServerErrorException();
    }
  }

  async getPaymentsWithReadUncommittedLevel(): Promise<Payment[]> {
    const readUncommitedLevel = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });

    try {
      // PostgreSQL에서 Read Uncommited 격리 수준은 Read Committed처럼 동작한다.
      //    Dirty Read를 확인할 수 없다.
      const payments = await this.paymentModel.findAll({
        transaction: readUncommitedLevel,
      });
      await readUncommitedLevel.commit();
      return payments;
    } catch (error) {
      await readUncommitedLevel.rollback();
    }
  }

  // 트랜잭션 격리 수준: Read Committed
  async createWithReadCommitedLevel(
    createPaymentDto: CreatePaymentDto,
  ): Promise<void> {
    const readCommittedLevel = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const { amount } = createPaymentDto;
      const payment = await this.paymentModel.findByPk(
        'e200372e-98cf-45ee-9394-53c95bb17d67',
      );
      await payment.update({ amount: 100000000 });
      await readCommittedLevel.commit();
    } catch (error) {
      await readCommittedLevel.rollback();
      throw new InternalServerErrorException();
    }
  }

  //
  async getPaymentsWithReadCommittedLevel(): Promise<void> {
    const readCommittedLevel = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const paymentWithAmount = await this.paymentModel.findByPk(
        'e200372e-98cf-45ee-9394-53c95bb17d67',
        { attributes: ['amount'] },
      );
      console.log(`결제 금액: ${paymentWithAmount.amount}`);

      const paymentWithAmountTax = await this.paymentModel.findByPk(
        'e200372e-98cf-45ee-9394-53c95bb17d67',
        { attributes: ['amount', 'tax'] },
      );
      console.log(
        `세금 제외 결제 금액: ${
          paymentWithAmountTax.amount - paymentWithAmountTax.tax
        }`,
      );

      // 여러 로직 수행 후 최종 금액에서 수수료를 뺀 값을 결과로 리턴
      setTimeout(async () => {
        // Non repeatable read 확인
        const paymentWithAmountCommission = await this.paymentModel.findByPk(
          'e200372e-98cf-45ee-9394-53c95bb17d67',
          { attributes: ['amount', 'commission'] },
        );
        console.log(
          `수수료 제외 결제 금액: ${
            paymentWithAmountCommission.amount -
            paymentWithAmountCommission.commission
          }`,
        );
        await readCommittedLevel.commit();
      }, 10000);
    } catch (error) {
      await readCommittedLevel.rollback();
      throw new InternalServerErrorException();
    }
  }

  // Read Committed 격리 수준에서 발생하는 Phantom Read 현상
  async getPaymentsWithReadCommittedLevelRepeatedly() {
    const readCommittedLevel = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      setInterval(async () => {
        console.log(await this.paymentModel.findAll());
      }, 3000);
    } catch (error) {
      await readCommittedLevel.rollback();
    }
  }
}
