import { Controller, Get, Param, Post, Body, Headers } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private paypalService: PaypalService) {}

  @Post('create-subscription')
  async createSubscriptionPayment() {
    return await this.paypalService.createSubscriptionPayment();
  }

  @Post('approve-subscription/:id')
  async approveSubscriptionPayment(@Param('id') subscription_id: string) {
    console.log('sdfsdfg', subscription_id);
    return await this.paypalService.approveSubscriptionPayment(subscription_id);
  }

  @Get('check-subscription/:id')
  async checkSubscriptionPayment(@Param('id') subscription_id: string) {
    console.log('sdfsdfg', subscription_id);
    return await this.paypalService.checkSubscriptionPayment(subscription_id);
  }

  @Get('create-order')
  async createOrder() {
    const url = await this.paypalService.createOrder();
    return url;
  }

  @Get('create-payment_for_the_order/:id')
  async approveOrder(@Param('id') id: string) {
    return await this.paypalService.approveOrder(id);
  }

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
