import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { GetFilterDto } from './get-filter.dto';
import { Transform } from 'class-transformer';
import { toNumber } from '../helpers/transform.helper';

export class ShortLinkDto {
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  link: string;
}

export class GetLinksDto extends GetFilterDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @IsOptional()
  take?: number;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @IsOptional()
  skip: number;
}
