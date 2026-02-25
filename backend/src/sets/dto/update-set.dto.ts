import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Difficulty } from '../schemas/flashcard-set.schema';

export class UpdateSetDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;
}
