import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashcardSet, FlashcardSetSchema } from './schemas/flashcard-set.schema';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FlashcardSet.name, schema: FlashcardSetSchema }])],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService, MongooseModule],
})
export class SetsModule {}
