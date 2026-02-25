import { IsBoolean } from 'class-validator';

export class MarkLearnedDto {
  @IsBoolean()
  learned: boolean;
}
