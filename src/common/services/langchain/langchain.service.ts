import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { AskDto, AskDtoWithParser } from './dto/ask.dto';

@Injectable()
export class LangchainService {
  private readonly langchain: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!openAIApiKey) return;

    this.langchain = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-1106',
      temperature: 1,
    });
  }

  ask<T extends object>(data: AskDtoWithParser): Promise<T>;
  ask(data: AskDto): Promise<string>;

  async ask<T extends object>(data: AskDto | AskDtoWithParser) {
    if ('parser' in data) {
      const parser = new JsonOutputFunctionsParser<T>();

      const runnable = this.langchain
        .bind({
          functions: [data.parser],
          function_call: { name: data.parser.name },
        })
        .pipe(parser);

      return await runnable.invoke([new HumanMessage(data.question)]);
    }

    const response = await this.langchain.invoke([
      new HumanMessage(data.question),
    ]);

    return response.content as string;
  }
}
