import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtAccessConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (ConfigService: ConfigService) => {
    const options = {
      secret: ConfigService.get<string>('JWT_ACCESS_SECRET'),
      signOptions: {
        expiresIn: ConfigService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      },
    };
    console.log(options);
    return options;
  },
};
