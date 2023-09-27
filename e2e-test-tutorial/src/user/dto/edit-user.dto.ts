import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

// class-validator 유효성 검사 적용
// 라우트 핸들러 @Body 데코레이터의 new ValidationPipe()
export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
