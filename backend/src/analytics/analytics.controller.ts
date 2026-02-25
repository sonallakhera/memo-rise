import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

interface RequestWithUser {
  user: { _id: string };
}

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('streak')
  streak(@Req() req: RequestWithUser) {
    return this.analyticsService.streak(String(req.user._id));
  }

  @Get('memorize-score')
  memorizeScore(@Req() req: RequestWithUser) {
    return this.analyticsService.memorizeScore(String(req.user._id));
  }
}
