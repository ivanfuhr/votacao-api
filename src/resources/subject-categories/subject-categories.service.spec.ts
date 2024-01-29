import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../config/prisma/prisma.service';
import { SubjectCategoriesService } from './subject-categories.service';

describe('SubjectCategoriesService', () => {
  let subjectCategoriesService: SubjectCategoriesService;

  const prismaService = {
    subjectCategory: {
      findMany: jest.fn().mockImplementation(() => {
        return [
          {
            name: 'Category 1',
          },
          {
            name: 'Category 2',
          },
        ];
      }),

      findUnique: jest.fn().mockImplementation((params: any) => {
        if (params.where.id === 'not-exist-id') {
          return null;
        }

        return {
          id: params.id,
          title: 'Category 1',
        };
      }),

      create: jest.fn().mockImplementation((params: any) => {
        return {
          id: 'exist-id',
          title: params.data.title,
        };
      }),

      update: jest.fn().mockImplementation((params: any) => {
        return {
          id: params.id,
          title: params.data.title,
        };
      }),

      delete: jest.fn().mockImplementation((params: any) => {
        return {
          id: params.where.id,
          title: 'Category 1',
        };
      }),
    },
    subject: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubjectCategoriesService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    subjectCategoriesService = moduleRef.get<SubjectCategoriesService>(
      SubjectCategoriesService,
    );
  });

  describe('findAll', () => {
    it('should return an array of subject categories', async () => {
      const result = await subjectCategoriesService.findAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return an error if the category does not exist', async () => {
      try {
        await subjectCategoriesService.findOne('not-exist-id');
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Categoria não encontrada!');
      }
    });

    it('should return a subject category', async () => {
      const result = await subjectCategoriesService.findOne('exist-id');

      expect(result).toHaveProperty('id');
    });
  });

  describe('create', () => {
    it('should return a new subject category', async () => {
      const data = {
        title: 'Category 1',
      };

      const result = await subjectCategoriesService.create({ data });

      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should return an error if the category does not exist', async () => {
      try {
        await subjectCategoriesService.update({
          id: 'not-exist-id',
          data: {
            title: 'Category 1',
          },
        });
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Categoria não encontrada!');
      }
    });

    it('should return an updated subject category', async () => {
      const result = await subjectCategoriesService.update({
        id: 'exist-id',
        data: {
          title: 'Category 1',
        },
      });

      expect(result).toHaveProperty('id');
    });
  });

  describe('delete', () => {
    it('should return an error if the category does not exist', async () => {
      try {
        await subjectCategoriesService.delete('not-exist-id');
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Categoria não encontrada!');
      }
    });

    it('should return a deleted subject category', async () => {
      const result = await subjectCategoriesService.delete('exist-id');

      expect(result).toHaveProperty('id');
    });
  });
});
