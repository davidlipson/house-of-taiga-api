import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
import { ColorDto } from './color.dto';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  colour?: ColorDto;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  // TODO: file/image
}
