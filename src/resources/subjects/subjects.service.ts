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

  async findAll() {
    return this.prismaService.subject.findMany({
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prismaService.subject.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            title: true,
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
