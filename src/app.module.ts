import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarService } from './car/car.service';
import { CarModule } from './car/car.module';
import { VanModule } from './van/van.module';
import { JeepModule } from './jeep/jeep.module';
import { BikeService } from './bike/bike.service';
import { BikeModule } from './bike/bike.module';
import { PaypalModule } from './paypal/paypal.module';
import { configValidationSchema } from './config/config.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['src/config/config.env'],
      validationSchema: configValidationSchema,
    }),
    CarModule,
    VanModule,
    JeepModule,
    BikeModule,
    PaypalModule,
  ],
  controllers: [AppController],
  providers: [AppService, CarService, BikeService],
})
export class AppModule {}
