import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subject } from '@prisma/client';
import { PaginateFunction, paginator } from 'src/common/helpers/paginator';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SubjectCategoriesService } from '../subject-categories/subject-categories.service';
import { UsersService } from '../users/users.service';
import { CreateSubjectDto } from './schemas/create-subject.schema';

@Injectable()
export class SubjectsService {
  private paginate: PaginateFunction;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly subjectCategoriesService: SubjectCategoriesService,
    private readonly usersService: UsersService,
  ) {
    this.paginate = paginator({
      perPage: 10,
    });
  }

  async findAllActive({
    userId,
    page,
    categoryId,
  }: {
    userId?: string;
    page: number;
    categoryId?: string;
  }) {
    if (categoryId) {
      await this.subjectCategoriesService.findOne(categoryId);
    }

    if (userId) {
      await this.usersService.findById(userId);
    }

    return this.paginate<Subject, any>(
      this.prismaService.subject,
      {
        select: {
          id: true,
          title: true,
          description: true,
          startAt: true,
          endAt: true,
          timeToEnd: true,
          category: {
            select: {
              id: true,
              title: true,
            },
          },
          votes: {
            where: {
              userId,
            },
            select: {
              id: true,
              type: true,
            },
          },
        },
        where: {
          categoryId,
          endAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      { page },
    );
  }

  async findAll({ page }: { page: number }) {
    return this.paginate<Subject, any>(
      this.prismaService.subject,
      {
        select: {
          id: true,
          title: true,
          description: true,
          startAt: true,
          endAt: true,
          timeToEnd: true,
          category: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      { page },
    );
  }

  async findOne({ id, userId }: { id: string; userId?: string }) {
    if (userId) {
      await this.usersService.findById(userId);
    }

    const subject = this.prismaService.subject.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        startAt: true,
        endAt: true,
        timeToEnd: true,
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        votes: {
          where: {
            userId,
          },
          select: {
            id: true,
            type: true,
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException('Pauta não encontrada');
    }

    return subject;
  }

  async findByUserVotes({ userId, page }: { userId: string; page: number }) {
    if (userId) {
      await this.usersService.findById(userId);
    }

    return this.paginate<Subject, any>(
      this.prismaService.subject,
      {
        select: {
          id: true,
          title: true,
          description: true,
          startAt: true,
          endAt: true,
          timeToEnd: true,
          category: {
            select: {
              id: true,
              title: true,
            },
          },
          votes: {
            select: {
              id: true,
              userId: true,
              type: true,
            },
          },
        },
        where: {
          votes: {
            some: {
              userId,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      { page },
    );
  }

  async create(params: { data: CreateSubjectDto }) {
    const { data } = params;

    const categoryExists = await this.subjectCategoriesService.findOne(
      data.categoryId,
    );

    if (!categoryExists) {
      throw new BadRequestException('Categoria não encontrada');
    }

    const endAt = this.calculeEndAt(data.startAt, data.timeToEnd);

    return this.prismaService.subject.create({
      data: {
        ...data,
        endAt,
      },
    });
  }

  async update(params: { id: string; data: CreateSubjectDto }) {
    const { id, data } = params;

    await this.subjectCategoriesService.findOne(data.categoryId);
    await this.findOne({ id });

    const endAt = this.calculeEndAt(data.startAt, data.timeToEnd);

    return this.prismaService.subject.update({
      where: { id },
      data: {
        ...data,
        endAt,
      },
    });
  }

  async delete(params: { id: string }) {
    const { id } = params;

    await this.findOne({ id });

    await this.prismaService.subjectVote.deleteMany({
      where: {
        subjectId: id,
      },
    });

    return this.prismaService.subject.delete({
      where: { id },
    });
  }

  private calculeEndAt(startAt: Date | string, timeToEnd: number = 60) {
    const startAtInTime = new Date(startAt).getTime();
    const timeToEndInMiliseconds = timeToEnd * 1000;

    return new Date(startAtInTime + timeToEndInMiliseconds);
  }

  itsOpen(subject: Subject) {
    const now = new Date().getTime();
    const startTime = subject.startAt.getTime();
    const endTime = startTime + subject.timeToEnd * 1000;

    return now >= startTime && now <= endTime;
  }
}
