import { Controller, Get, Param, Post, Body, Headers } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private paypalService: PaypalService) {}

  //create subscription
  @Post('create-subscription')
  async createSubscriptionPayment() {
    return await this.paypalService.createSubscriptionPayment();
  }

  //check status in subscription
  @Get('check-subscription/:id')
  async checkSubscriptionPayment(@Param('id') subscription_id: string) {
    return await this.paypalService.checkSubscriptionPayment(subscription_id);
  }

  //create order
  @Get('create-order')
  async createOrder() {
    return await this.paypalService.createOrder();
  }

  //approve the order
  @Get('create-payment-for-the-order/:id')
  async approveOrder(@Param('id') id: string) {
    return await this.paypalService.approveOrder(id);
  }

  //webhook
  @Post('one-time-payment/webhook')
  async webHookCallBack(
    @Body() webHookBody: any,
    @Headers('paypal-transmission-id') transmission_id: string,
    @Headers('paypal-transmission-time') transmission_time: string,
    @Headers('paypal-transmission-sig') transmission_sig: string,
    @Headers('paypal-cert-url') cert_url: string,
    @Headers('paypal-auth-algo') auth_algo: string,
    @Headers('correlation-id') correlation_id: string,
  ) {
    return await this.paypalService.SubscriptionWebHookCallBack({
      transmission_id: transmission_id,
      transmission_time: transmission_time,
      transmission_sig: transmission_sig,
      cert_url: cert_url,
      auth_algo: auth_algo,
      correlation_id: correlation_id,
      body: webHookBody,
    });
  }
}
