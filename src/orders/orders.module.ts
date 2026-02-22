import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { InMemoryOrderRepository } from './adapters/in-memory-order.repository';
import { ORDER_REPOSITORY_TOKEN } from './ports/order-repository.interface';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDER_REPOSITORY_TOKEN,
      useClass: InMemoryOrderRepository,
    },
  ],
})
export class OrdersModule { }
