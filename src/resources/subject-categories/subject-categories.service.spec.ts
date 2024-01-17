import { Test, TestingModule } from '@nestjs/testing';
import { SubjectCategoriesService } from './subject-categories.service';

describe('SubjectCategoriesService', () => {
  let service: SubjectCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectCategoriesService],
    }).compile();

    service = module.get<SubjectCategoriesService>(SubjectCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
