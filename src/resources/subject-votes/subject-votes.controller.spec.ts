import { Test, TestingModule } from '@nestjs/testing';
import { SubjectVotesController } from './subject-votes.controller';
import { SubjectVotesService } from './subject-votes.service';

describe('SubjectVotesController', () => {
  let controller: SubjectVotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectVotesController],
      providers: [SubjectVotesService],
    }).compile();

    controller = module.get<SubjectVotesController>(SubjectVotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
