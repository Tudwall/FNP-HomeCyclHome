import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@Controller('cycles')
export class CyclesController {
  constructor(private readonly cyclesService: CyclesService) {}

  @Post()
  create(@Body() createCycleDto: CreateCycleDto) {
    return this.cyclesService.create(createCycleDto);
  }

  @Get()
  findAll() {
    return this.cyclesService.findAll();
  }

  @Get(':userId')
  findAllByUser(@Param('userId') id: string) {
    return this.cyclesService.findAllByUser(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cyclesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCycleDto: UpdateCycleDto) {
    return this.cyclesService.update(+id, updateCycleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cyclesService.remove(+id);
  }
}
