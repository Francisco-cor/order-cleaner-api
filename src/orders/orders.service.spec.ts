import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { NetSuiteOrder } from './interfaces/netsuite-order.interface';

describe('OrdersService', () => {
    let service: OrdersService;
    let httpService: HttpService;
    let configService: ConfigService;

    const mockHttpService = {
        post: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue('https://dummy-netsuite-url.com'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                { provide: HttpService, useValue: mockHttpService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
        httpService = module.get<HttpService>(HttpService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
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

    describe('sendToNetSuite', () => {
        it('should send a POST request to NetSuite API and return the data', async () => {
            const mockOrder: NetSuiteOrder = {
                externalId: 'ORD-123',
                entity: 'John Doe',
                trandate: '2026-02-02T16:40:07-06:00',
                memo: 'Test order',
                location: 'Main Warehouse',
                subsidiary: '1',
                items: [],
                shippingAddress: {
                    addr1: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'USA',
                },
                source: 'Web',
                status: 'pending_sync',
            };

            const mockResponse = {
                data: { success: true, internalId: 'NS-456' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as any },
            };
            mockHttpService.post.mockReturnValue(of(mockResponse));

            const result = await service.sendToNetSuite(mockOrder);

            expect(configService.get).toHaveBeenCalledWith('NETSUITE_API_URL');
            expect(httpService.post).toHaveBeenCalledWith('https://dummy-netsuite-url.com', mockOrder);
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw an error if the HTTP request fails', async () => {
            const mockOrder = {} as NetSuiteOrder;
            const error = new Error('API Error');
            mockHttpService.post.mockReturnValue(throwError(() => error));

            await expect(service.sendToNetSuite(mockOrder)).rejects.toThrow('API Error');
        });
    });
});
