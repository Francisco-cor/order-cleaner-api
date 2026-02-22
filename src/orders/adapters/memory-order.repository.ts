import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order-repository.interface';

@Injectable()
export class MemoryOrderRepository implements OrderRepository {
    private readonly syncedOrders = new Set<string>();

    async exists(id: string): Promise<boolean> {
        return this.syncedOrders.has(id);
    }

    async save(id: string): Promise<void> {
        this.syncedOrders.add(id);
    }
}
