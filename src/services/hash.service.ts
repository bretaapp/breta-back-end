import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(data: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data, salt);

    return hash;
  }
}
