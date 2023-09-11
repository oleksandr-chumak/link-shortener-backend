import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;
  @IsNotEmpty()
  @IsString()
  newConfirmPassword: string;
  @IsNotEmpty()
  @IsString()
  token: string;
}
