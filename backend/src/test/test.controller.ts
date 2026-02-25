import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Difficulty } from '../sets/schemas/flashcard-set.schema';
import { TestService } from './test.service';

interface RequestWithUser {
  user: { _id: string };
}

@Controller('test')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('by-set/:setId')
  bySet(@Req() req: RequestWithUser, @Param('setId') setId: string) {
    return this.testService.testBySet(String(req.user._id), setId);
  }

  @Get('by-difficulty/:difficulty')
  byDifficulty(@Req() req: RequestWithUser, @Param('difficulty') difficulty: Difficulty) {
    return this.testService.testByDifficulty(String(req.user._id), difficulty);
  }

  @Get('automatic')
  automatic(@Req() req: RequestWithUser) {
    return this.testService.automaticTest(String(req.user._id));
  }

  @Post('complete')
  complete(@Req() req: RequestWithUser) {
    return this.testService.markTestCompleted(String(req.user._id));
  }
}
