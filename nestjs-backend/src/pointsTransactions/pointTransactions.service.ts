import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import PointTransaction, {
  POINT_TRANSACTION_STATUS_ENUM,
} from './model/pointTransaction.model';
import { CreatePointTransactionDto } from './dto/create-pointTransaction.dto';
import { IGetUser } from 'src/commons/interfaces/get-user.decorator.interface';
import { UsersService } from 'src/users/users.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class PointTransactionsService {
  constructor(
    @InjectModel(PointTransaction)
    private readonly pointTransactionModel: typeof PointTransaction, //
    private readonly usersSerivce: UsersService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    createPointTransactionDto: CreatePointTransactionDto,
    user: IGetUser,
  ): Promise<PointTransaction> {
    const { id: userId } = user;
    const { impUid, amount } = createPointTransactionDto;

    // 트랜잭션 시작, createPointTransaction에 저장
    const createPointTransaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE, // Serializable 격리 수준 적용
    });

    try {
      // 결제 내역 저장
      const pointTransaction = await this.pointTransactionModel.create(
        {
          impUid,
          amount,
          status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
          userId,
        },
        { transaction: createPointTransaction },
      );

      // 유저 포인트 업데이트
      //    락을 걸고 유저 조회
      const user = await this.usersSerivce.getUserByPkWithLock(userId);
      await user.update(
        { point: user.point + amount },
        { transaction: createPointTransaction },
      );

      // 트랜잭션 커밋 후 결제 내역 리턴
      await createPointTransaction.commit();
      return pointTransaction;
    } catch (error) {
      // 트랜잭션 롤백 후 500 에러 리턴
      await createPointTransaction.rollback();
      throw new InternalServerErrorException();
    }
  }
}
