import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.subject.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.subject.findUnique({ where: { id } });
  }

  async create(data: Prisma.SubjectUncheckedCreateInput) {
    return this.prismaService.subject.create({ data });
  }
}
