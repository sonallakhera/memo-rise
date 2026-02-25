import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true, timestamps: true })
export class Flashcard {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  definition: string;

  @Prop({ default: false })
  learned: boolean;

  @Prop({ type: Date })
  lastReviewedAt?: Date;

  @Prop({ type: Date })
  nextReviewAt?: Date;
}

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
