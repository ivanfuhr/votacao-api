import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma/prisma.service';

@Injectable()
export class SubjectCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.subjectCategory.findMany();
  }

  async findOne(id: string) {
    const result = await this.prismaService.subjectCategory.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Categoria não encontrada!`);
    }

    return result;
  }

  create(params: { data: Prisma.SubjectCategoryUncheckedCreateInput }) {
    return this.prismaService.subjectCategory.create(params);
  }

  async update(params: {
    id: string;
    data: Prisma.SubjectCategoryUncheckedUpdateInput;
  }) {
    const category = await this.prismaService.subjectCategory.findUnique({
      where: { id: params.id },
    });

    if (!category) {
      throw new NotFoundException(`Categoria não encontrada!`);
    }

    return this.prismaService.subjectCategory.update({
      where: { id: params.id },
      data: params.data,
    });
  }

  async delete(id: string) {
    const category = await this.prismaService.subjectCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Categoria não encontrada!`);
    }

    await this.prismaService.subject.deleteMany({
      where: { categoryId: id },
    });

    return this.prismaService.subjectCategory.delete({ where: { id } });
  }
}
