import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PaginateFunction, paginator } from 'src/common/helpers/paginator';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UpdateUserDto } from './schemas/update-user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  private paginate: PaginateFunction;

  constructor(private readonly prismaService: PrismaService) {
    this.paginate = paginator({
      perPage: 10,
    });
  }

  async onModuleInit() {
    try {
      const userExists = await this.prismaService.user.findFirst({
        where: {
          isDefault: true,
        },
      });

      if (!userExists) {
        const response = await this.prismaService.user.create({
          data: {
            name: 'Admin',
            email: 'admin@admin.com',
            password: await bcrypt.hash('admin', 10),
            document: '000.000.000-00',
            role: 'ADMIN',
            isDefault: true,
          },
        });

        console.log('Usuário padrão criado');
        console.log(
          `Dados de acesso:\n\nDocumento: ${response.document}\nSenha: admin`,
        );
      }
    } catch (error) {
      console.log(
        'Erro ao criar usuário padrão, verifique o erro abaixo:',
        error,
      );
    }
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
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

    return this.prismaService.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        document,
        role,
      },
    });
  }

  async findByDocument(document: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        document,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findAll({ page }: { page: number }) {
    return this.paginate(
      this.prismaService.user,
      {
        select: {
          id: true,
          name: true,
          email: true,
          document: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      { page },
    );
  }

  async findByIdWeb(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        document: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update({ id, data }: { id: string; data: UpdateUserDto }) {
    const { name, email, password, document, role } = data;

    const userExists = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (userExists.isDefault && role !== 'ADMIN') {
      throw new BadRequestException('O usuário padrão só pode ser ADMIN');
    }

    const checkEmailOrDocumentExists = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email: email,
          },
          {
            document: document,
          },
        ],
        NOT: {
          id: id,
        },
      },
    });

    if (checkEmailOrDocumentExists) {
      throw new BadRequestException('E-mail ou documento já cadastrado');
    }

    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password: password ? await bcrypt.hash(password, 10) : undefined,
        document,
        role,
      },
    });
  }

  async delete(id: string) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (userExists.isDefault) {
      throw new BadRequestException('Não é possível excluir o usuário padrão');
    }

    await this.prismaService.subjectVote.deleteMany({
      where: {
        userId: id,
      },
    });

    return await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
