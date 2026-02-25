import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Difficulty, FlashcardSet, FlashcardSetDocument } from '../sets/schemas/flashcard-set.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

const WEIGHTS: Record<Difficulty, number> = {
  easy: 1,
  good: 2,
  hard: 3,
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(FlashcardSet.name)
    private readonly setModel: Model<FlashcardSetDocument>,
  ) {}

  async streak(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return { dailyStreak: user.dailyStreak ?? 0 };
  }

  async memorizeScore(userId: string) {
    const sets = await this.setModel.find({ userId }).lean();

    let learnedWeighted = 0;
    let totalWeighted = 0;

    for (const set of sets) {
      const weight = WEIGHTS[set.difficulty] ?? 1;
      for (const card of set.cards) {
        totalWeighted += weight;
        if (card.learned) {
          learnedWeighted += weight;
        }
      }
    }

    const score = totalWeighted === 0 ? 0 : Math.round((learnedWeighted / totalWeighted) * 100);

    return {
      memorizeScore: score,
      learnedWeighted,
      totalWeighted,
    };
  }
}
