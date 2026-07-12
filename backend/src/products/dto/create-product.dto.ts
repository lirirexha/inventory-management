import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}
