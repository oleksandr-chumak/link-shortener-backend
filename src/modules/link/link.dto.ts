import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ShortLinkDto {
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  link: string;
}

export class GetOriginalLinkDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
