import { Test, TestingModule } from '@nestjs/testing';
import { Playerselectws } from './playerselectws';

describe('Playerselectws', () => {
  let provider: Playerselectws;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Playerselectws],
    }).compile();

    provider = module.get<Playerselectws>(Playerselectws);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
