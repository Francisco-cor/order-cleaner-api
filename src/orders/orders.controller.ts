import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create and sync an order to NetSuite' })
    @ApiResponse({ status: 201, description: 'Order successfully synced to NetSuite.' })
    @ApiResponse({ status: 400, description: 'Invalid order data.' })
    @ApiResponse({ status: 409, description: 'Duplicate order detected.' })
    @ApiResponse({ status: 502, description: 'NetSuite internal server error.' })
    async create(@Body() createOrderDto: CreateOrderDto) {
        const cleanedOrder = this.ordersService.cleanOrder(createOrderDto);
        return await this.ordersService.sendToNetSuite(cleanedOrder);
    }
}
