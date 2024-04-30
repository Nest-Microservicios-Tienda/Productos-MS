import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  public price: number;
}
