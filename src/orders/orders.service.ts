import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
    cleanOrder(orderData: any) {
        // 1. Placeholder for Validation (Structural)
        // 2. Data Normalization (Cleaning)
        const cleanedOrder = {
            ...orderData,
            customerName: typeof orderData.customerName === 'string' ? orderData.customerName.trim() : orderData.customerName,
            address: typeof orderData.address === 'string' ? orderData.address.trim() : orderData.address,
            status: 'CLEANED', // State transition example
            cleanedAt: new Date(),
        };

        return cleanedOrder;
    }
}
