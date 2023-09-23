import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  Validate,
} from 'class-validator';
import { toDateArray, toNumberArray } from '../helpers/transform.helper';
import { FirstElementLessThanOrEqualSecondConstraint } from '../validators/first-element-less-than-or-equal-second.constraint';
import { IsArrayOrStringConstraint } from '../validators/is-array-or-string.constraint';

export class GetFilterDto {
  @Transform(({ value }) => toNumberArray(value))
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Validate(FirstElementLessThanOrEqualSecondConstraint)
  @IsOptional()
  clicks?: number[];

  @IsOptional()
  @Validate(IsArrayOrStringConstraint)
  status?: string | string[];

  @Transform(({ value }) => toDateArray(value))
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Validate(FirstElementLessThanOrEqualSecondConstraint)
  @IsOptional()
  date?: Date[];

  @Validate(IsArrayOrStringConstraint)
  @IsOptional()
  host?: string | string[];
}
