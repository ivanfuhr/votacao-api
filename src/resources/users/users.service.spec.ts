import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PaginatedResult, paginator } from '../../common/helpers/paginator';
import { PrismaService } from '../../config/prisma/prisma.service';
import { UpdateUserDto } from './schemas/update-user.schema';
import { UsersService } from './users.service';

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

describe('UsersService', () => {
  let usersService: UsersService;

  const prismaService = {
    user: {
      findFirst: jest.fn().mockImplementation((params: any) => {
        if (
          params.where?.OR?.some(
            (condition: any) => condition.email === 'existing-email',
          )
        ) {
          return { id: 'existing-id' };
        }

        if (
          params.where?.OR?.some(
            (condition: any) => condition.document === 'existing-document',
          )
        ) {
          return { id: 'existing-id' };
        }

        if (params.where.document === 'non-existing-document') {
          return null;
        }

        if (params.where.document === 'existing-document') {
          return { id: 'existing-id' };
        }

        return null;
      }),

      findUnique: jest.fn().mockImplementation((params: any) => {
        if (
          params.where.id === 'existing-id' &&
          params?.select?.password === false
        ) {
          return { id: 'existing-id' };
        }

        if (params.where.id === 'existing-id') {
          return { id: 'existing-id', password: 'password' };
        }

        return null;
      }),

      create: jest.fn().mockImplementation((params: any) => {
        return { id: 'created-id', ...params.data };
      }),

      update: jest.fn().mockImplementation((params: any) => {
        return { id: 'updated-id', ...params.data };
      }),

      delete: jest.fn().mockImplementation(() => {
        return { id: 'deleted-id' };
      }),

      findMany: jest.fn().mockImplementation(() => {
        return [];
      }),
    },

    subjectVote: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should return an error if the document already exists', async () => {
      const data = {
        document: 'existing-document',
      } as Prisma.UserUncheckedCreateInput;

      try {
        await usersService.create(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('E-mail ou documento já cadastrado');
      }
    });

    it('should return an error if the email already exists', async () => {
      const data = {
        email: 'existing-email',
      } as Prisma.UserUncheckedCreateInput;

      try {
        await usersService.create(data);
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('E-mail ou documento já cadastrado');
      }
    });

    it('should return the created user', async () => {
      const data = {
        name: 'John Doe',
        email: 'johndoe@teste.com',
        document: '000.000.000-00',
        password: '12345678',
      } as Prisma.UserUncheckedCreateInput;

      const result = await usersService.create(data);

      expect(result).toHaveProperty('id');
    });
  });

  describe('findByDocument', () => {
    it('should return an error if the user does not exist', async () => {
      try {
        await usersService.findByDocument('non-existing-document');
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return the user', async () => {
      const result = await usersService.findByDocument('existing-document');

      expect(result).toHaveProperty('id');
    });
  });

  describe('findById', () => {
    it('should return an error if the user does not exist', async () => {
      try {
        await usersService.findById('non-existing-id');
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return the user', async () => {
      const result = await usersService.findById('existing-id');

      expect(result).toHaveProperty('id');
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
      const result = await usersService.findAll(data);

      expect(paginator).toHaveBeenCalledWith({ perPage: 10 });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('total');
    });
  });

  describe('findByIdWeb', () => {
    it('should return an error if the user does not exist', async () => {
      try {
        await usersService.findByIdWeb('non-existing-id');
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return the user without password', async () => {
      const result = await usersService.findByIdWeb('existing-id');

      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('update', () => {
    it('should return an error if the user does not exist', async () => {
      const data = {} as UpdateUserDto;

      try {
        await usersService.update({
          id: 'non-existing-id',
          data,
        });

        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return an error if the document already exists', async () => {
      const data = {
        document: 'existing-document',
      } as UpdateUserDto;

      try {
        await usersService.update({
          id: 'existing-id',
          data,
        });

        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('E-mail ou documento já cadastrado');
      }
    });

    it('should return an error if the email already exists', async () => {
      const data = {
        email: 'existing-email',
      } as UpdateUserDto;

      try {
        await usersService.update({
          id: 'existing-id',
          data,
        });

        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('E-mail ou documento já cadastrado');
      }
    });

    it('should return the updated user', async () => {
      const data = {
        name: 'John Doe',
        email: 'johndoe@teste.com',
        document: '000.000.000-00',
        password: '12345678',
      } as UpdateUserDto;

      const result = await usersService.update({
        id: 'existing-id',
        data,
      });

      expect(result).toHaveProperty('id');
    });
  });

  describe('delete', () => {
    it('should return an error if the user does not exist', async () => {
      try {
        await usersService.delete('non-existing-id');
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Usuário não encontrado');
      }
    });

    it('should return the deleted user', async () => {
      const result = await usersService.delete('existing-id');

      expect(result).toHaveProperty('id');
    });
  });
});
