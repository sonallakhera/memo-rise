import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateSetDto } from './dto/create-set.dto';
import { MarkLearnedDto } from './dto/mark-learned.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { SetsService } from './sets.service';

interface RequestWithUser {
  user: { _id: string };
}

@Controller('sets')
@UseGuards(JwtAuthGuard)
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post()
  createSet(@Req() req: RequestWithUser, @Body() dto: CreateSetDto) {
    return this.setsService.createSet(String(req.user._id), dto);
  }

  @Get()
  listSets(@Req() req: RequestWithUser) {
    return this.setsService.listSets(String(req.user._id));
  }

  @Get(':id')
  getSet(@Req() req: RequestWithUser, @Param('id') setId: string) {
    return this.setsService.getSet(String(req.user._id), setId);
  }

  @Put(':id')
  updateSet(@Req() req: RequestWithUser, @Param('id') setId: string, @Body() dto: UpdateSetDto) {
    return this.setsService.updateSet(String(req.user._id), setId, dto);
  }

  @Delete(':id')
  deleteSet(@Req() req: RequestWithUser, @Param('id') setId: string) {
    return this.setsService.deleteSet(String(req.user._id), setId);
  }

  @Post(':setId/cards')
  addCard(
    @Req() req: RequestWithUser,
    @Param('setId') setId: string,
    @Body() dto: CreateCardDto,
  ) {
    return this.setsService.addCard(String(req.user._id), setId, dto);
  }

  @Put(':setId/cards/:cardId')
  updateCard(
    @Req() req: RequestWithUser,
    @Param('setId') setId: string,
    @Param('cardId') cardId: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.setsService.updateCard(String(req.user._id), setId, cardId, dto);
  }

  @Delete(':setId/cards/:cardId')
  deleteCard(@Req() req: RequestWithUser, @Param('setId') setId: string, @Param('cardId') cardId: string) {
    return this.setsService.deleteCard(String(req.user._id), setId, cardId);
  }

  @Post(':setId/cards/:cardId/mark-learned')
  markLearned(
    @Req() req: RequestWithUser,
    @Param('setId') setId: string,
    @Param('cardId') cardId: string,
    @Body() dto: MarkLearnedDto,
  ) {
    return this.setsService.markLearned(String(req.user._id), setId, cardId, dto);
  }
}
