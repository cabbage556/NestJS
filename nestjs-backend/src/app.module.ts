import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { sequelizeConfig } from './config/sequelize.config';
import { ProductsModule } from './products/products.module';
import { ProductsCategoriesModule } from './productsCategories/productsCategories.module';
import { AuthModule } from './auth/auth.module';
import { PointTransactionsModule } from './pointsTransactions/pointTransactions.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/config/env/.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRootAsync(sequelizeConfig),
    ProductsModule,
    ProductsCategoriesModule,
    AuthModule,
    PointTransactionsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
