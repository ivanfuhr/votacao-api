import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SubjectsService } from '../subjects/subjects.service';

@Injectable()
export class SubjectVotesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly subjectsService: SubjectsService,
  ) {}

  private async validadeSubject(subjectId: string) {
    const subjectExists = await this.subjectsService.findOne(subjectId);

    if (!subjectExists) {
      throw new BadRequestException('Pauta não encontrada');
    }

    if (!this.subjectsService.itsOpen(subjectExists)) {
      throw new BadRequestException('Pauta não está aberta para votação');
    }
  }

  async create(params: { data: Prisma.SubjectVoteUncheckedCreateInput }) {
    const { data } = params;

    await this.validadeSubject(data.subjectId);

    const userVotedOnSubject = await this.prismaService.subjectVote.findFirst({
      where: {
        subjectId: data.subjectId,
        userId: data.userId,
      },
    });

    if (userVotedOnSubject) {
      throw new BadRequestException('Você já votou nesta pauta');
    }

    return this.prismaService.subjectVote.create(params);
  }

  async update(params: { data: Prisma.SubjectVoteUncheckedCreateInput }) {
    const { data } = params;

    await this.validadeSubject(data.subjectId);

    const userVotedOnSubject = await this.prismaService.subjectVote.findFirst({
      where: {
        subjectId: data.subjectId,
        userId: data.userId,
      },
    });

    if (!userVotedOnSubject) {
      throw new BadRequestException('Você ainda não votou nesta pauta');
    }

    return this.prismaService.subjectVote.update({
      where: {
        id: userVotedOnSubject.id,
      },
      data: {
        type: data.type,
      },
    });
  }
}
