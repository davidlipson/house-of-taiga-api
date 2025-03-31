import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class ColorDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(360)
  h?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  s?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  v?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  a?: number;
}
