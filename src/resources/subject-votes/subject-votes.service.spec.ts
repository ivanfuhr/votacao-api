import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma/prisma.service';
import { SubjectsService } from '../subjects/subjects.service';
import { SubjectVotesService } from './subject-votes.service';

describe('SubjectVotesService', () => {
  let subjectVotesService: SubjectVotesService;

  const prismaService = {
    subjectVote: {
      findFirst: jest.fn().mockImplementation((params: any) => {
        if (params.where.userId === 'voted-user-id') {
          return { id: 'voted-subject-vote-id' };
        }

        return null;
      }),

      create: jest.fn().mockImplementation(() => {
        return { id: 'created-subject-vote-id' };
      }),

      findOne: jest.fn().mockImplementation((params: any) => {
        if (params.where.id === 'not-existing-id') {
          return null;
        }

        return { id: 'subject-vote-id' };
      }),

      findMany: jest.fn().mockImplementation(() => {
        return [
          {
            type: 'YES',
          },
          {
            type: 'NO',
          },
        ];
      }),
    },
  };

  const subjectsService = {
    findOne: jest.fn().mockImplementation((params: any) => {
      if (params.id === 'not-existing-id') {
        throw new NotFoundException('Pauta não encontrada');
      }

      if (params.id === 'closed-subject-id') {
        return { endAt: new Date(new Date().getTime() - 1000) };
      }

      return { endAt: new Date(new Date().getTime() + 1000) };
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubjectVotesService,
        { provide: PrismaService, useValue: prismaService },
        { provide: SubjectsService, useValue: subjectsService },
      ],
    }).compile();

    subjectVotesService =
      moduleRef.get<SubjectVotesService>(SubjectVotesService);
  });

  describe('create', () => {
    it('should return an error if the subject does not exist', async () => {
      const data = {
        subjectId: 'not-existing-id',
      } as Prisma.SubjectVoteUncheckedCreateInput;

      try {
        await subjectVotesService.create({ data });
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Pauta não encontrada');
      }
    });

    it('should return an error if the subject is not open', async () => {
      const data = {
        subjectId: 'closed-subject-id',
      } as Prisma.SubjectVoteUncheckedCreateInput;

      try {
        await subjectVotesService.create({ data });
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Pauta não está aberta para votação');
      }
    });

    it('should return an error if the user already voted on the subject', async () => {
      const data = {
        subjectId: 'subject-id',
        userId: 'voted-user-id',
      } as Prisma.SubjectVoteUncheckedCreateInput;

      try {
        await subjectVotesService.create({ data });
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Você já votou nesta pauta');
      }
    });

    it('should return the created subject vote', async () => {
      const data = {
        subjectId: 'subject-id',
        userId: 'user-id',
        type: 'YES',
      } as Prisma.SubjectVoteUncheckedCreateInput;

      const result = await subjectVotesService.create({ data });

      expect(result).toHaveProperty('id');
    });
  });

  describe('results', () => {
    it('should return an error if the subject does not exist', async () => {
      try {
        await subjectVotesService.results({ subjectId: 'not-existing-id' });
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Pauta não encontrada');
      }
    });

    it('should return the subject results', async () => {
      const result = await subjectVotesService.results({
        subjectId: 'subject-id',
      });

      expect(result).toHaveProperty('totalVotes');
      expect(result).toHaveProperty('votesYes');
      expect(result).toHaveProperty('votesNo');
      expect(result).toHaveProperty('percentVotesYes');
      expect(result).toHaveProperty('percentVotesNo');
    });
  });
});
