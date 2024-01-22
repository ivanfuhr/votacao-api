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
    const subjectExists = await this.subjectsService.findOne({ id: subjectId });

    if (!subjectExists) {
      throw new BadRequestException('Pauta não encontrada');
    }

    if (subjectExists.endAt < new Date()) {
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

  async results({ subjectId }: { subjectId: string }) {
    const votes = await this.prismaService.subjectVote.findMany({
      where: {
        subjectId,
      },
      select: {
        type: true,
      },
    });

    const totalVotes = votes.length;

    const votesYes = votes.filter((vote) => vote.type === 'YES').length;
    const votesNo = votes.filter((vote) => vote.type === 'NO').length;

    const percentVotesYes = (votesYes / totalVotes) * 100;
    const percentVotesNo = (votesNo / totalVotes) * 100;

    return {
      totalVotes,
      votesYes,
      votesNo,
      percentVotesYes,
      percentVotesNo,
    };
  }
}
