import {
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RequestUser } from 'src/common/types/AuthUserRequest';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVoteDto, createVoteSchema } from './schemas/create-vote.schema';
import { SubjectVotesService } from './subject-votes.service';

@Controller('subject-votes')
export class SubjectVotesController {
  constructor(private readonly subjectVotesService: SubjectVotesService) {}

  @Post('/vote')
  @UsePipes(new ZodValidationPipe(createVoteSchema))
  @UseGuards(JwtAuthGuard)
  async vote(@Body() body: CreateVoteDto, @User() user: RequestUser) {
    return this.subjectVotesService.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
  }

  @Put('/vote')
  @UsePipes(new ZodValidationPipe(createVoteSchema))
  @UseGuards(JwtAuthGuard)
  async updateVote(@Body() body: CreateVoteDto, @User() user: RequestUser) {
    return this.subjectVotesService.update({
      data: {
        ...body,
        userId: user.id,
      },
    });
  }
}
