import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateSetDto } from './dto/create-set.dto';
import { MarkLearnedDto } from './dto/mark-learned.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { Difficulty, FlashcardSet, FlashcardSetDocument } from './schemas/flashcard-set.schema';

const DIFFICULTY_DAYS: Record<Difficulty, number> = {
  [Difficulty.EASY]: 7,
  [Difficulty.GOOD]: 3,
  [Difficulty.HARD]: 1,
};

@Injectable()
export class SetsService {
  constructor(
    @InjectModel(FlashcardSet.name)
    private readonly setModel: Model<FlashcardSetDocument>,
  ) {}

  async createSet(userId: string, dto: CreateSetDto) {
    const totalSets = await this.setModel.countDocuments({ userId });
    if (totalSets >= 100) {
      throw new BadRequestException('Maximum of 100 sets per user reached.');
    }

    try {
      return await this.setModel.create({
        userId,
        name: dto.name,
        difficulty: dto.difficulty,
      });
    } catch (error: unknown) {
      if (this.isDuplicateError(error)) {
        throw new ConflictException('Set name must be unique per user.');
      }
      throw error;
    }
  }

  listSets(userId: string) {
    return this.setModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async getSet(userId: string, setId: string) {
    const set = await this.findOwnedSet(userId, setId);
    return set.toObject();
  }

  async updateSet(userId: string, setId: string, dto: UpdateSetDto) {
    const set = await this.findOwnedSet(userId, setId);

    if (dto.name !== undefined) {
      set.name = dto.name;
    }
    if (dto.difficulty !== undefined) {
      set.difficulty = dto.difficulty;
    }

    try {
      await set.save();
      return set.toObject();
    } catch (error: unknown) {
      if (this.isDuplicateError(error)) {
        throw new ConflictException('Set name must be unique per user.');
      }
      throw error;
    }
  }

  async deleteSet(userId: string, setId: string) {
    const set = await this.findOwnedSet(userId, setId);
    await set.deleteOne();
    return { deleted: true };
  }

  async addCard(userId: string, setId: string, dto: CreateCardDto) {
    const set = await this.findOwnedSet(userId, setId);

    if (set.cards.length >= 100) {
      throw new BadRequestException('Maximum of 100 cards per set reached.');
    }

    const nextReviewAt = this.nextReviewDate(set.difficulty);
    set.cards.push({
      _id: new Types.ObjectId(),
      title: dto.title,
      definition: dto.definition,
      learned: false,
      nextReviewAt,
    } as never);
    await set.save();

    return set.cards[set.cards.length - 1];
  }

  async updateCard(userId: string, setId: string, cardId: string, dto: UpdateCardDto) {
    const set = await this.findOwnedSet(userId, setId);
    const card = this.findCardInSet(set, cardId);

    if (dto.title !== undefined) {
      card.title = dto.title;
    }
    if (dto.definition !== undefined) {
      card.definition = dto.definition;
    }

    await set.save();

    return card;
  }

  async deleteCard(userId: string, setId: string, cardId: string) {
    const set = await this.findOwnedSet(userId, setId);
    const before = set.cards.length;
    set.cards = set.cards.filter((card) => card._id.toString() !== cardId) as never;

    if (set.cards.length === before) {
      throw new NotFoundException('Card not found.');
    }

    await set.save();
    return { deleted: true };
  }

  async markLearned(userId: string, setId: string, cardId: string, dto: MarkLearnedDto) {
    const set = await this.findOwnedSet(userId, setId);
    const card = this.findCardInSet(set, cardId);

    card.learned = dto.learned;
    card.lastReviewedAt = new Date();
    card.nextReviewAt = dto.learned ? undefined : this.nextReviewDate(set.difficulty);

    set.learned = set.cards.length > 0 && set.cards.every((entry) => entry.learned);

    await set.save();
    return card;
  }

  nextReviewDate(difficulty: Difficulty) {
    const days = DIFFICULTY_DAYS[difficulty] ?? DIFFICULTY_DAYS[Difficulty.GOOD];
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private async findOwnedSet(userId: string, setId: string) {
    const set = await this.setModel.findById(setId);
    if (!set) {
      throw new NotFoundException('Set not found.');
    }

    if (set.userId.toString() !== userId) {
      throw new ForbiddenException('Set does not belong to user.');
    }

    return set;
  }

  private findCardInSet(set: FlashcardSetDocument, cardId: string) {
    const card = set.cards.find((entry) => entry._id.toString() === cardId);
    if (!card) {
      throw new NotFoundException('Card not found.');
    }

    return card;
  }

  private isDuplicateError(error: unknown) {
    return typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000;
  }
}
