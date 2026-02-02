import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';

describe('OrdersService', () => {
    let service: OrdersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OrdersService],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('cleanOrder', () => {
        it('should trim strings and normalize casing for state and country', () => {
            const dto: CreateOrderDto = {
                externalId: ' ORD-123 ',
                customerName: ' John Doe ',
                customerEmail: 'john@example.com',
                addressLine1: ' 123 Main St ',
                city: ' New York ',
                state: ' ny ',
                zipCode: ' 10001 ',
                country: ' usa ',
                source: ' Web Store ',
                items: [
                    {
                        sku: ' SKU-001 ',
                        quantity: 2,
                        unitPrice: 10,
                    },
                ],
            };

            const result = service.cleanOrder(dto);

            expect(result.externalId).toBe('ORD-123');
            expect(result.entity).toBe('John Doe');
            expect(result.shippingAddress.addr1).toBe('123 Main St');
            expect(result.shippingAddress.city).toBe('New York');
            expect(result.shippingAddress.state).toBe('NY');
            expect(result.shippingAddress.country).toBe('USA');
            expect(result.source).toBe('Web Store');
            expect(result.items[0].itemId).toBe('SKU-001');
            expect(result.items[0].description).toBe('SKU: SKU-001');
            expect(result.status).toBe('pending_sync');
            expect(result.trandate).toBeDefined();
        });

        it('should handle optional addressLine2', () => {
            const dto: CreateOrderDto = {
                externalId: 'ORD-123',
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                addressLine1: '123 Main St',
                addressLine2: ' Suite 100 ',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                source: 'Web',
                items: [],
            };

            const result = service.cleanOrder(dto);
            expect(result.shippingAddress.addr2).toBe('Suite 100');
        });
    });
});
