import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async create(@Body() createOrderDto: CreateOrderDto) {
        const cleanedOrder = this.ordersService.cleanOrder(createOrderDto);
        return await this.ordersService.sendToNetSuite(cleanedOrder);
    }
}
