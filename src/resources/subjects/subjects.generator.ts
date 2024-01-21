import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LangchainService } from 'src/common/services/langchain.service';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { SubjectCategoriesService } from '../subject-categories/subject-categories.service';
import {
  CreateSubjectGeneratorDto,
  createSubjectGeneratorSchema,
} from './schemas/create-subject-generator.schema';
import { SubjectsService } from './subjects.service';

@Injectable()
export class SubjectsGenerator {
  constructor(
    private readonly langchainService: LangchainService,
    private readonly subjectCategoriesService: SubjectCategoriesService,
    private readonly subjectsService: SubjectsService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    disabled:
      process.env.AUTO_GENERATE_TOPICS !== 'true' ||
      !process.env.OPENAI_API_KEY,
  })
  async handleCronGenerator() {
    const randomCategory = await this.getRandomCategory();

    const question = `Desenvolva uma pauta sobre ${randomCategory.title} onde o usuario deve ter um questionamento sobre o assunto e o questionamente deve ser possível responder com SIM ou NÃO`;

    const response = await this.langchainService.ask<CreateSubjectGeneratorDto>(
      {
        question,
        parser: {
          name: 'createSubjectGenerator',
          description: 'Cria uma pauta aleatória',
          parameters: zodToJsonSchema(createSubjectGeneratorSchema),
        },
      },
    );

    const { title, description } = response;

    const minTimeToEndInSeconds = 30; // 30 segundos
    const maxTimeToEndInSeconds = 600; // 10 minutos

    const randomTimeToEnd = Math.floor(
      Math.random() * (maxTimeToEndInSeconds - minTimeToEndInSeconds) +
        minTimeToEndInSeconds,
    );

    await this.subjectsService.create({
      data: {
        title,
        description,
        categoryId: randomCategory.id,
        timeToEnd: randomTimeToEnd,
        startAt: new Date(),
      },
    });
  }

  private async getRandomCategory() {
    const categories = await this.subjectCategoriesService.findAll();

    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }
}
