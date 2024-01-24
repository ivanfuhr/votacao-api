import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class SubjectCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.subjectCategory.findMany();
  }

  findOne(id: string) {
    return this.prismaService.subjectCategory.findUnique({ where: { id } });
  }

  create(params: { data: Prisma.SubjectCategoryUncheckedCreateInput }) {
    return this.prismaService.subjectCategory.create(params);
  }

  update(params: {
    id: string;
    data: Prisma.SubjectCategoryUncheckedUpdateInput;
  }) {
    return this.prismaService.subjectCategory.update({
      where: { id: params.id },
      data: params.data,
    });
  }

  async delete(id: string) {
    await this.prismaService.subject.deleteMany({
      where: { categoryId: id },
    });

    return this.prismaService.subjectCategory.delete({ where: { id } });
  }
}
