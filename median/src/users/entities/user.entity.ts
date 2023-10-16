import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    // this에 partial 객체의 속성 복사해 붙여넣고, this 리턴
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  // omitting the @ApiProperty decorator will only hide the password property from the Swagger documentation
  // the property will still be visible in the response body
  @Exclude()
  password: string;
}
