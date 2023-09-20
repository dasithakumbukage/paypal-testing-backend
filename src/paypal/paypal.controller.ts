import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private paypalService: PaypalService) {}

  @Get('create-order')
  async createSubscriptionOrder() {
    const url = await this.paypalService.createOrder();
    return url;
  }

  @Get('create-payment_for_the_order/:id')
  async createSubscriptionPayment(@Param('id') id: string) {
    console.log('query', id);
    return await this.paypalService.createPayment(id);
  }

  @Post('one-time-payment/webhook')
  async webHookCallBack(
    @Body() getSubscriptionWebHookCallBack: any,
    // @Headers() headers: any,
    @Headers('paypal-transmission-id') transmission_id: string,
    @Headers('paypal-transmission-time') transmission_time: string,
    @Headers('paypal-transmission-sig') transmission_sig: string,
    @Headers('paypal-cert-url') cert_url: string,
    @Headers('paypal-auth-algo') auth_algo: string,
    @Headers('correlation-id') correlation_id: string,
  ) {
    return await this.paypalService.getSubscriptionWebHookCallBack({
      transmission_id: transmission_id,
      transmission_time: transmission_time,
      transmission_sig: transmission_sig,
      cert_url: cert_url,
      auth_algo: auth_algo,
      correlation_id: correlation_id,
      body: getSubscriptionWebHookCallBack,
    });
  }
}
