import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Query,
  Logger,
  Get,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoinPaymentService } from './coin-payment.service';

@Controller('coin-payment')
export class CoinPaymentController {
  constructor(private readonly coinPaymentService: CoinPaymentService) {}
  //create coin-payment txn
  @Post('create')
  async createCoinPayment(@Body() body: any): Promise<any> {
    return await this.coinPaymentService.createCoinPayment(body);
  }

  //listen to the IPN url
  @Post('coin-payment-webhook')
  @UseInterceptors(FileInterceptor('file'))
  async listenToWebhook(
    @Body() callBackData: any,
    @Headers('hmac') hmac: any,
  ) {
    return await this.coinPaymentService.handleCallBackdetails(
      callBackData,
      hmac,
    );
  }
}
