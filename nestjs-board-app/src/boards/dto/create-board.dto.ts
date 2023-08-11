import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
  // 유효성 검사(파이프 사용)
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  contents: string;
}
