import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Global 모듈 선언
//    Global 모듈을 선언하면 이 모듈이 필요한 모듈에서 모두 import할 필요가 없음
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
