import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCycleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  bikeBrand: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  bikeModel: string;
}
