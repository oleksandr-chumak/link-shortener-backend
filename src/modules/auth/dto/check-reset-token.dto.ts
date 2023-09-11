import { IsNotEmpty, IsString } from 'class-validator';

export class CheckResetTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
