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
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
    @ApiProperty({ description: 'The SKU of the item', example: 'ITEM-001' })
    @IsString()
    @IsNotEmpty()
    sku!: string;

    @ApiProperty({ description: 'The quantity of items', example: 2, minimum: 1 })
    @IsNumber()
    @Min(1)
    quantity!: number;

    @ApiProperty({ description: 'The unit price of the item', example: 10.5, minimum: 0 })
    @IsNumber()
    @Min(0)
    unitPrice!: number;
}

export class CreateOrderDto {
    @ApiProperty({ description: 'The external ID of the order', example: 'ORD-12345' })
    @IsString()
    @IsNotEmpty()
    externalId!: string;

    @ApiProperty({ description: 'The customer email address', example: 'client@example.com' })
    @IsEmail()
    customerEmail!: string;

    @ApiProperty({ description: 'The customer name', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    customerName!: string;

    @ApiProperty({ description: 'The first line of the shipping address', example: '123 Main St' })
    @IsString()
    @IsNotEmpty()
    addressLine1!: string;

    @ApiProperty({ description: 'The second line of the shipping address (optional)', example: 'Apt 4B', required: false })
    @IsString()
    @IsOptional()
    addressLine2?: string;

    @ApiProperty({ description: 'City of the shipping address', example: 'New York' })
    @IsString()
    @IsNotEmpty()
    city!: string;

    @ApiProperty({ description: 'State of the shipping address', example: 'NY' })
    @IsString()
    @IsNotEmpty()
    state!: string;

    @ApiProperty({ description: 'Zip code of the shipping address', example: '10001' })
    @IsString()
    @IsNotEmpty()
    zipCode!: string;

    @ApiProperty({ description: 'Country of the shipping address', example: 'USA' })
    @IsString()
    @IsNotEmpty()
    country!: string;

    @ApiProperty({ description: 'List of items in the order', type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];

    @ApiProperty({ description: 'Source of the order', example: 'Shopify' })
    @IsString()
    @IsNotEmpty()
    source!: string;
}
