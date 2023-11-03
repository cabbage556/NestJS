import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FreezePipe implements PipeTransform {
  private readonly logger = new Logger(FreezePipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.debug('FreezePipe running...');

    // 입력 데이터 동결
    Object.freeze(value);
    return value;
  }
}
