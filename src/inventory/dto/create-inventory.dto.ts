import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateInventoryDto {
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
  @Min(0)
  cost: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  // TODO: file/image
}
