import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ReplaceAddressDto {
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  number?: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  street: string;

  @Transform(trim)
  @Matches(/^\d{5}$/, { message: 'postalCode doit contenir 5 chiffres' })
  postalCode: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  locality: string;
}
