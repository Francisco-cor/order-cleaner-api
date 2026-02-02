import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NETSUITE_API_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
