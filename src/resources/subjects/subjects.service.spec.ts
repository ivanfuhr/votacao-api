import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Subject } from '@prisma/client';
import { PaginatedResult, paginator } from '../../common/helpers/paginator';
import { PrismaService } from '../../config/prisma/prisma.service';
import { SubjectCategoriesService } from '../subject-categories/subject-categories.service';
import { UsersService } from '../users/users.service';
import { CreateSubjectDto } from './schemas/create-subject.schema';
import { SubjectsService } from './subjects.service';

jest.mock('../../common/helpers/paginator', () => ({
  paginator: jest.fn().mockImplementation((defaultOptions) => {
    if (defaultOptions.perPage === 10) {
      return jest.fn().mockImplementation(async () => {
        const mockPaginatedResult: PaginatedResult<any> = {
          data: [],
          meta: {
            total: 0,
            lastPage: 1,
            currentPage: 1,
            perPage: 10,
            prev: null,
            next: null,
          },
        };
        return mockPaginatedResult;
      });
    }
  }),
}));

describe('SubjectsService', () => {
  let subjectsService: SubjectsService;

  const prismaService = {
    subject: {
      findUnique: jest.fn().mockImplementation((params: any) => {
        if (params.where.id === 'invalid-id') {
          return null;
        }

        return {
          id: params.where.id,
        } as Subject;
      }),
      create: jest.fn().mockImplementation((params: any) => {
        return {
          id: params.data.id,
        } as Subject;
      }),
      update: jest.fn().mockImplementation((params: any) => {
        if (params.where.id === 'invalid-id') {
          return null;
        }

        return {
          id: params.where.id,
        } as Subject;
      }),
      delete: jest.fn().mockImplementation((params: any) => {
        if (params.where.id === 'invalid-id') {
          return null;
        }

        return {
          id: params.where.id,
        } as Subject;
      }),
    },
    subjectVote: {
      deleteMany: jest.fn(),
    },
  };

  const mockSubjectCategoriesService = {
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === 'invalid-id') {
        throw new NotFoundException(`Categoria não encontrada!`);
      }
    }),
  };

  const mockUsersService = {
    findById: jest.fn().mockImplementation((id: string) => {
      if (id === 'invalid-id') {
        throw new NotFoundException(`Usuário não encontrado`);
      }

      return {};
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubjectsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: SubjectCategoriesService,
          useValue: mockSubjectCategoriesService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    subjectsService = moduleRef.get<SubjectsService>(SubjectsService);
  });

  describe('findAllActive', () => {
    it('should return an error if a category is entered that does not exist', async () => {
      const data = { page: 1, categoryId: 'invalid-id' };

      try {
        await subjectsService.findAllActive(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Categoria não encontrada!');
      }
    });

    it('should return an error if a user is informed that does not exist', async () => {
      const data = { page: 1, userId: 'invalid-id' };

      try {
        await subjectsService.findAllActive(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return a paginated list of subjects', async () => {
      const mockPaginatedResult: PaginatedResult<any> = {
        data: [],
        meta: {
          total: 0,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
          prev: null,
          next: null,
        },
      };

      (paginator as jest.Mock).mockReturnValueOnce(
        async () => mockPaginatedResult,
      );

      const data = { page: 1 };

      const result = await subjectsService.findAllActive(data);

      expect(paginator).toHaveBeenCalledWith({ perPage: 10 });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('total');
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of subjects', async () => {
      const mockPaginatedResult: PaginatedResult<any> = {
        data: [],
        meta: {
          total: 0,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
          prev: null,
          next: null,
        },
      };

      (paginator as jest.Mock).mockReturnValueOnce(
        async () => mockPaginatedResult,
      );

      const data = { page: 1 };

      const result = await subjectsService.findAll(data);

      expect(paginator).toHaveBeenCalledWith({ perPage: 10 });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('total');
    });
  });

  describe('findOne', () => {
    it('should return an error if a user is informed that does not exist', async () => {
      const data = { id: 'valid-id', userId: 'invalid-id' };

      try {
        await subjectsService.findOne(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return an error if the subject does not exist', async () => {
      const data = { id: 'invalid-id' };

      try {
        await subjectsService.findOne(data);

        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Pauta não encontrada');
      }
    });

    it('should return an pauta', async () => {
      const data = { id: 'edea944f-8f50-48a9-b2bb-eeac203d6576' };

      const result = await subjectsService.findOne(data);

      expect(result).toHaveProperty('id');
    });
  });

  describe('findByUserVotes', () => {
    it('should return an error if a user is informed that does not exist', async () => {
      const data = { page: 1, userId: 'invalid-id' };

      try {
        await subjectsService.findByUserVotes(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return a paginated list of subjects', async () => {
      const mockPaginatedResult: PaginatedResult<any> = {
        data: [],
        meta: {
          total: 0,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
          prev: null,
          next: null,
        },
      };

      (paginator as jest.Mock).mockReturnValueOnce(
        async () => mockPaginatedResult,
      );

      const data = { page: 1, userId: 'valid-id' };

      const result = await subjectsService.findByUserVotes(data);

      expect(paginator).toHaveBeenCalledWith({ perPage: 10 });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('total');
    });
  });

  describe('create', () => {
    it('should return an error if a category is entered that does not exist', async () => {
      const data = {
        data: {
          categoryId: 'invalid-id',
        } as CreateSubjectDto,
      };

      try {
        await subjectsService.create(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Categoria não encontrada!');
      }
    });

    it('should return a created subject', async () => {
      const data = {
        data: {} as CreateSubjectDto,
      };

      const result = await subjectsService.create(data);

      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should return an error if a category is entered that does not exist', async () => {
      const data = {
        id: 'valid-id',
        data: {
          categoryId: 'invalid-id',
        } as CreateSubjectDto,
      };

      try {
        await subjectsService.update(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Categoria não encontrada!');
      }
    });

    it('should return an error if the subject does not exist', async () => {
      const data = {
        id: 'invalid-id',
        data: {} as CreateSubjectDto,
      };

      try {
        await subjectsService.update(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Pauta não encontrada');
      }
    });

    it('should return a updated subject', async () => {
      const data = {
        id: 'valid-id',
        data: {} as CreateSubjectDto,
      };

      const result = await subjectsService.update(data);

      expect(result).toHaveProperty('id');
    });
  });

  describe('delete', () => {
    it('should return an error if the subject does not exist', async () => {
      const data = {
        id: 'invalid-id',
      };

      try {
        await subjectsService.delete(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Pauta não encontrada');
      }
    });

    it('should return a deleted subject', async () => {
      const data = {
        id: 'valid-id',
      };

      const result = await subjectsService.delete(data);

      expect(result).toHaveProperty('id');
    });
  });
});
