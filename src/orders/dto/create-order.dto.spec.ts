import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto, OrderItemDto } from './create-order.dto';

describe('CreateOrderDto', () => {
    let dto: CreateOrderDto;

    beforeEach(() => {
        const validItem = new OrderItemDto();
        validItem.sku = 'ITEM-001';
        validItem.quantity = 2;
        validItem.unitPrice = 10.5;

        dto = new CreateOrderDto();
        dto.externalId = 'ORD-123';
        dto.customerEmail = 'test@example.com';
        dto.customerName = 'John Doe';
        dto.addressLine1 = '123 Main St';
        dto.city = 'New York';
        dto.state = 'NY';
        dto.zipCode = '10001';
        dto.country = 'USA';
        dto.source = 'Web';
        dto.items = [validItem];
    });

    it('should pass validation with valid data', async () => {
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation with an invalid email', async () => {
        dto.customerEmail = 'invalid-email';
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('customerEmail');
    });

    it('should fail validation with negative quantity in items', async () => {
        dto.items[0].quantity = -1;
        const errors = await validate(dto);

        // items validation is nested, so we check the children property
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('items');
        expect(errors[0].children?.[0].children?.[0].property).toBe('quantity');
    });

    it('should fail validation with negative unitPrice in items', async () => {
        dto.items[0].unitPrice = -5;
        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('items');
        expect(errors[0].children?.[0].children?.[0].property).toBe('unitPrice');
    });

    it('should fail validation when required fields are missing', async () => {
        const emptyDto = new CreateOrderDto();
        const errors = await validate(emptyDto);
        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('externalId');
        expect(properties).toContain('customerEmail');
        expect(properties).toContain('customerName');
        expect(properties).toContain('items');
    });
});
