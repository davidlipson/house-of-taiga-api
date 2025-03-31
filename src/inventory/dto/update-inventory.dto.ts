import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsOptional()
  colour?: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
