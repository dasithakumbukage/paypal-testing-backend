import { Body, Controller, Headers, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  //create membership
  @Post('create-payment')
  async createMembership(@Body() data: any) {
    console.log('create-payment');
    return await this.stripeService.createMembership(data);
  }

  //webhook
  @Post(`subscription-webhook`)
  async paymentWebhook(
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.stripeService.paymentWebhook(body, signature);
  }
}