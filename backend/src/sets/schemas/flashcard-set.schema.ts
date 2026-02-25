import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Flashcard, FlashcardSchema } from './flashcard.schema';

export enum Difficulty {
  EASY = 'easy',
  GOOD = 'good',
  HARD = 'hard',
}

export type FlashcardSetDocument = HydratedDocument<FlashcardSet>;

@Schema({ timestamps: true })
export class FlashcardSet {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 50 })
  name: string;

  @Prop({ type: [FlashcardSchema], default: [] })
  cards: Flashcard[];

  @Prop({ enum: Difficulty, default: Difficulty.GOOD })
  difficulty: Difficulty;

  @Prop({ default: false })
  learned: boolean;
}

export const FlashcardSetSchema = SchemaFactory.createForClass(FlashcardSet);

FlashcardSetSchema.index({ userId: 1, name: 1 }, { unique: true });
