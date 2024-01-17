import { Test, TestingModule } from '@nestjs/testing';
import { SubjectCategoriesController } from './subject-categories.controller';
import { SubjectCategoriesService } from './subject-categories.service';

describe('SubjectCategoriesController', () => {
  let controller: SubjectCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectCategoriesController],
      providers: [SubjectCategoriesService],
    }).compile();

    controller = module.get<SubjectCategoriesController>(
      SubjectCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
