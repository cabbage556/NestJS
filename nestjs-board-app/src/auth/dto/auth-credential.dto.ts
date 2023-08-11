import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(
    /^[a-zA-Z0-9]*$/, // 영어랑 숫자만
    { message: "entered wrong password" },
  )
  password: string;
}
