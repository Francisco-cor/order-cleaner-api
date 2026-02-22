import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MemoryOrderRepository } from './adapters/memory-order.repository';
import { ORDER_REPOSITORY_TOKEN } from './ports/order-repository.interface';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDER_REPOSITORY_TOKEN,
      useClass: MemoryOrderRepository,
    },
  ],
})
export class OrdersModule { }
