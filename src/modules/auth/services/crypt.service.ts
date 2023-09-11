import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

@Injectable()
export class CryptService {
  hash(password: string): Promise<string> {
    console.log(password);
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const saltRounds = +process.env.HASH_SALTED_ROUND;
    return bcrypt.hash(password, saltRounds);
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
