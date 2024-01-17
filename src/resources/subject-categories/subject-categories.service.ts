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
}
