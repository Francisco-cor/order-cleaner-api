import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga variables de entorno globalmente
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
