import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'Breta-Beauty API',
      status: 'The API is running',
    };
  }
}
