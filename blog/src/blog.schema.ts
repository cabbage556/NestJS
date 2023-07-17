import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Blog 타입이면서 몽고디비의 도큐먼트로 사용할 수 있는 BlogDocument 타입 정의
export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  name: string;

  @Prop()
  createdDt: Date;

  @Prop()
  updatedDt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog); // 스키마 생성
