import { IsString, IsOptional, IsArray } from 'class-validator';

export class FindAllInventoryDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
