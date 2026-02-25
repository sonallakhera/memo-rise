import { IsOptional, IsString } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { hasMaxWords } from '../../common/word-limit.util';

function MaxWords(maxWords: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxWords',
      target: object.constructor,
      propertyName,
      constraints: [maxWords],
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (value === undefined) {
            return true;
          }
          return hasMaxWords(value, maxWords);
        },
      },
    });
  };
}

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @MaxWords(50, { message: 'Title must be at most 50 words.' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxWords(50, { message: 'Definition must be at most 50 words.' })
  definition?: string;
}
