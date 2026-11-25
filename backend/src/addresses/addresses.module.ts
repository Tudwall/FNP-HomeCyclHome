import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  providers: [AddressesService],
  controllers: [AddressesController],
})
export class AddressesModule {}
