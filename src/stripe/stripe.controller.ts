import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Get,
  Res,
} from '@nestjs/common';
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
    @Body() data: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.stripeService.paymentWebhook(data, signature);
  }

  //cancel membership
  @Post('cancel-membership-subscription/:id')
  async cancelMembershipSubscription(@Param('id') id: string) {
    return await this.stripeService.cancelMembershipSubscription(id);
  }

  //list all active subscriptions
  @Get('get-all-active-subscriptions')
  async listActiveSubscription() {
    return await this.stripeService.listActiveSubscription();
  }
}
