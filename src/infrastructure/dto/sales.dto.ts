import "reflect-metadata";
import { Expose, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from "class-validator";

export class CreateSaleDetailDto {
  @IsOptional()
  @IsNumber()
  @Expose()
  ticketId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  amount: number;
}

export class CreateSaleDto {
  @IsOptional()
  @IsNumber()
  @Expose()
  userId?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  partnerId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  @Expose()
  saleDetails: CreateSaleDetailDto[];
}

export class UpdateSaleDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  userId?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  partnerId?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  totalAmount?: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;
}

export class UpdateSaleDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  ticketId?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  amount?: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;
} 