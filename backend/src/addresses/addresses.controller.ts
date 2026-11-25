import { Body, Controller, Get, NotFoundException, Put } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import {
  type AuthUser,
  CurrentUser,
} from 'src/auth/decorators/current-user.decorator';
import { ReplaceAddressDto } from './dto/replace-address.dto';

@Controller('address')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findMine(@CurrentUser() user: AuthUser) {
    const address = await this.addressesService.findActive(user.userId);
    if (!address) {
      throw new NotFoundException('Aucune adresse');
    }
    return address;
  }

  @Put()
  replace(@CurrentUser() user: AuthUser, @Body() dto: ReplaceAddressDto) {
    return this.addressesService.replace(user.userId, dto);
  }
}
