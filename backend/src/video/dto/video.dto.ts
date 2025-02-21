import { IsString, MaxLength } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(120)
  description: string;
}
