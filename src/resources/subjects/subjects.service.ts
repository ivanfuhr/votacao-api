import { BadRequestException, Injectable } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SubjectCategoriesService } from '../subject-categories/subject-categories.service';
import { CreateSubjectDto } from './schemas/create-subject.schema';

@Injectable()
export class SubjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly subjectCategoriesService: SubjectCategoriesService,
  ) {}

  async findAll({ userId }: { userId?: string }) {
    return this.prismaService.subject.findMany({
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
        endAt: {
          gte: new Date(),
        },
      },
    });
  }

  async findOne({ id, userId }: { id: string; userId?: string }) {
    return this.prismaService.subject.findUnique({
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
  }

  async myVotes({ userId }: { userId: string }) {
    return this.prismaService.subject.findMany({
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
    });
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
