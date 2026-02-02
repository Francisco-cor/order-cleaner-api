import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NetSuiteOrder, NetSuiteOrderItem } from './interfaces/netsuite-order.interface';

@Injectable()
export class OrdersService {
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
