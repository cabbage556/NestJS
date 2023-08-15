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
      autoLoadModels: Boolean(configService.get('DATABASE_AUTOLOADMODELS')),
      synchronize: Boolean(configService.get('DATABASE_SYNCHRONIZE')),
      sync: {
        alter: Boolean(configService.get('DATABASE_SYNC_ALTER')),
      },
    };
    console.log(options);
    return options;
  },
};
