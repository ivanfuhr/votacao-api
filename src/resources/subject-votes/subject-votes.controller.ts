import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

  @Get('/results/:id')
  @UseGuards(JwtAuthGuard)
  async results(@Param('id') id: string) {
    return this.subjectVotesService.results({ subjectId: id });
  }
}
