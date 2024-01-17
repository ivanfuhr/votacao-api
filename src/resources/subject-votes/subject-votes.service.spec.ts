import { Test, TestingModule } from '@nestjs/testing';
import { SubjectVotesService } from './subject-votes.service';

describe('SubjectVotesService', () => {
  let service: SubjectVotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectVotesService],
    }).compile();

    service = module.get<SubjectVotesService>(SubjectVotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
