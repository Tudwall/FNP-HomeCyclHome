import { IsInt, IsPositive } from 'class-validator';

export class CreateBikeDto {
  @IsInt()
  @IsPositive()
  bikeModelId: number;

  @IsInt()
  @IsPositive()
  typeId: number;
}
