import { Module } from '@nestjs/common';
import { CoinPaymentController } from './coin-payment.controller';
import { CoinPaymentService } from './coin-payment.service';

@Module({
  controllers: [CoinPaymentController],
  providers: [CoinPaymentService]
})
export class CoinPaymentModule {}
