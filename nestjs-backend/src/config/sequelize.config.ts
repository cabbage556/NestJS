import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';

export const sequelizeConfig: SequelizeModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const options = {
      dialect: configService.get('DATABASE_DIALECT'),
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USERNAME'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_DATABASE'),
      models: [__dirname + '/../**/*.model.*'],
      autoLoadModels: configService.get('DATABASE_AUTOLOADMODELS'),
      synchronize: configService.get('DATABASE_SYNCHRONIZE'),
    };
    console.log(options);
    return options;
  },
};
