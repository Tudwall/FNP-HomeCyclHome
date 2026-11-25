import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReplaceAddressDto } from './dto/replace-address.dto';

const addressSelect = {
  id: true,
  number: true,
  street: true,
  postalCode: true,
  locality: true,
  country: true,
} as const;

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  findActive(userId: number) {
    return this.prisma.address.findFirst({
      where: { userId, deletedOn: null },
      select: addressSelect,
    });
  }

  async replace(userId: number, dto: ReplaceAddressDto) {
    const [, address] = await this.prisma.$transaction([
      this.prisma.address.updateMany({
        where: { userId, deletedOn: null },
        data: { deletedOn: new Date() },
      }),
      this.prisma.address.create({
        data: { ...dto, userId },
        select: addressSelect,
      }),
    ]);
    return address;
  }
}
