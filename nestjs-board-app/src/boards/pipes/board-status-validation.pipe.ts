import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { BoardStatus } from "../board-status.enum";

// 커스텀 파이프
//    PipeTransform 인터페이스 구현 transform 메서드
export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOption = [
    BoardStatus.PUBLIC, //
    BoardStatus.PRIVATE,
  ];

  // transform 메서드
  //   value: 파이프에 전달되는 값
  //   metadata: 파이프에 전달되는 값(value)의 메타데이터 객체
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    console.dir(metadata);

    value = value?.toUpperCase();
    if (!this.isValueValid(value)) {
      throw new BadRequestException(
        "wrong status value - not in the status option",
      );
    }

    return value;
  }

  isValueValid(value: any): boolean {
    return this.StatusOption.includes(value);
  }
}
