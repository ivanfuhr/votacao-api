import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SubjectCategoriesService } from '../subject-categories/subject-categories.service';

@Injectable()
export class SubjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly subjectCategoriesService: SubjectCategoriesService,
  ) {}

  async findAll() {
    return this.prismaService.subject.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.subject.findUnique({ where: { id } });
  }

  async create(params: { data: Prisma.SubjectUncheckedCreateInput }) {
    const { data } = params;

    const categoryExists = await this.subjectCategoriesService.findOne(
      data.categoryId,
    );

    if (!categoryExists) {
      throw new BadRequestException('Categoria não encontrada');
    }

    return this.prismaService.subject.create(params);
  }
}
