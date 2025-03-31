import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @MaxLength(30, { message: 'Name must have atmost 30 characters.' })
  @IsNotEmpty()
  name: string;
}
