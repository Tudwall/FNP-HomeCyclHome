import { PartialType } from '@nestjs/mapped-types';
import { CreateCycleDto } from './create-cycle.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCycleDto extends PartialType(CreateCycleDto) {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  bikeBrand: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  bikeModel: string;
}
