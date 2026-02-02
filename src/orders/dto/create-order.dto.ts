import {
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsEmail,
    IsNumber,
    IsOptional,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    sku!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsNumber()
    @Min(0)
    unitPrice!: number;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    externalId!: string;

    @IsEmail()
    customerEmail!: string;

    @IsString()
    @IsNotEmpty()
    customerName!: string;

    @IsString()
    @IsNotEmpty()
    addressLine1!: string;

    @IsString()
    @IsOptional()
    addressLine2?: string;

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    state!: string;

    @IsString()
    @IsNotEmpty()
    zipCode!: string;

    @IsString()
    @IsNotEmpty()
    country!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];

    @IsString()
    @IsNotEmpty()
    source!: string;
}
