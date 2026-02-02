import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { NetSuiteOrder, NetSuiteOrderItem } from './interfaces/netsuite-order.interface';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    cleanOrder(orderData: CreateOrderDto): NetSuiteOrder {
        return {
            externalId: this.trimString(orderData.externalId),
            entity: this.trimString(orderData.customerName),
            trandate: new Date().toISOString(),
            memo: `Order from ${orderData.source}`,
            location: 'Main Warehouse',
            subsidiary: '1',
            items: orderData.items.map((item) => this.cleanItem(item)),
            shippingAddress: {
                addr1: this.trimString(orderData.addressLine1),
                addr2: orderData.addressLine2 ? this.trimString(orderData.addressLine2) : undefined,
                city: this.trimString(orderData.city),
                state: this.toUpperCase(orderData.state),
                zip: this.trimString(orderData.zipCode),
                country: this.toUpperCase(orderData.country),
            },
            source: this.trimString(orderData.source),
            status: 'pending_sync',
        };
    }

    async sendToNetSuite(order: NetSuiteOrder): Promise<any> {
        const url = this.configService.get<string>('NETSUITE_API_URL') || '';
        this.logger.log(`Sending order ${order.externalId} to NetSuite at ${url}`);

        try {
            const response = await firstValueFrom(
                this.httpService.post(url, order),
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error sending order to NetSuite: ${errorMessage}`);
            throw error;
        }
    }

    private cleanItem(item: any): NetSuiteOrderItem {
        return {
            itemId: this.trimString(item.sku),
            quantity: item.quantity,
            rate: item.unitPrice,
            description: `SKU: ${this.trimString(item.sku)}`,
        };
    }

    private trimString(value: string): string {
        return value ? value.trim() : '';
    }

    private toUpperCase(value: string): string {
        return value ? value.trim().toUpperCase() : '';
    }
}
