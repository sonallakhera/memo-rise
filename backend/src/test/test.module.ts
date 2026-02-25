import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashcardSet, FlashcardSetSchema } from '../sets/schemas/flashcard-set.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashcardSet.name, schema: FlashcardSetSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
