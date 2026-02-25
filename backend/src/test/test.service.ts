import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Difficulty, FlashcardSet, FlashcardSetDocument } from '../sets/schemas/flashcard-set.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(FlashcardSet.name)
    private readonly setModel: Model<FlashcardSetDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async testBySet(userId: string, setId: string) {
    const set = await this.setModel.findOne({ _id: setId, userId }).lean();
    if (!set) {
      throw new NotFoundException('Set not found.');
    }

    return this.pick(
      set.cards.map((card) => ({ ...card, setId: set._id, setName: set.name, difficulty: set.difficulty })),
      10,
    );
  }

  async testByDifficulty(userId: string, difficulty: Difficulty) {
    const sets = await this.setModel.find({ userId, difficulty }).lean();
    const cards = sets.flatMap((set) =>
      set.cards.map((card) => ({ ...card, setId: set._id, setName: set.name, difficulty: set.difficulty })),
    );
    return this.pick(cards, 10);
  }

  async automaticTest(userId: string) {
    const now = new Date();
    const sets = await this.setModel.find({ userId }).lean();

    const dueCards = sets.flatMap((set) =>
      set.cards
        .filter((card) => {
          if (card.learned) {
            return false;
          }

          return !card.nextReviewAt || new Date(card.nextReviewAt).getTime() <= now.getTime();
        })
        .map((card) => ({ ...card, setId: set._id, setName: set.name, difficulty: set.difficulty })),
    );

    return this.pick(dueCards, 10);
  }

  async markTestCompleted(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const now = new Date();
    const previous = user.lastTestCompletedAt;

    if (!previous) {
      user.dailyStreak = 1;
    } else {
      const diffMs = now.getTime() - previous.getTime();
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

      if (diffDays <= 0) {
        user.dailyStreak = user.dailyStreak || 1;
      } else if (diffDays === 1) {
        user.dailyStreak += 1;
      } else {
        user.dailyStreak = 1;
      }
    }

    user.lastTestCompletedAt = now;
    await user.save();

    return { dailyStreak: user.dailyStreak };
  }

  private pick<T>(items: T[], count: number) {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
