type AskParser = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type AskDto = {
  question: string;
};

export type AskDtoWithParser = {
  question: string;
  parser: AskParser;
};
