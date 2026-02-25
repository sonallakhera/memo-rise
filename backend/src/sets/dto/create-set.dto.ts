import { IsEnum, IsString, MaxLength } from 'class-validator';
import { Difficulty } from '../schemas/flashcard-set.schema';

export class CreateSetDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
