import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
