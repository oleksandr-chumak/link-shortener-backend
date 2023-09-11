import { Payload } from '../interfaces';

export abstract class AccessService {
  abstract generateAccessToken(payload: Payload): Promise<string>;
  abstract verifyAccessToken(accessToken: string): Promise<Payload>;
}
