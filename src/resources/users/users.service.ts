import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(data: Prisma.UserUncheckedCreateInput) {
    const { name, email, password, document, role } = data;

    const checkEmailOrDocumentExists = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            document,
          },
        ],
      },
    });

    if (checkEmailOrDocumentExists) {
      throw new BadRequestException('E-mail ou documento já cadastrado');
    }

    return await this.prismaService.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        document,
        role,
      },
    });
  }
}
