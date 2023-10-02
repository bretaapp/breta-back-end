import { Test, TestingModule } from '@nestjs/testing';
import { SalonResolver } from './salon.resolver';
import { SalonService } from './salon.service';

describe('SalonResolver', () => {
  let resolver: SalonResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalonResolver, SalonService],
    }).compile();

    resolver = module.get<SalonResolver>(SalonResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
