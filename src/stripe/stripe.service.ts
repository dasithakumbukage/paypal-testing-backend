import { ForbiddenException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ICustomer } from './stripe.types';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51Nu5HNA5JEtiO6bcb4WM4feMmFIHgpOlval9ZcXktdHkgsVN1u43NfMFKWKR6FZQDlwBDsKLzaacEey8gLPNFl1g0084lG40bE',
      {
        apiVersion: '2023-08-16',
      },
    );
  }

  //create membership
  async createMembership(data: any) {
    const { amount, userId, paymentMethodId } = data;

    const stripe_customer_id = await this.stripe.customers
      .create({
        name: 'test',
        email: 'test@gmail.com',
        address: {
          city: '',
          country: '',
          line1: '',
          line2: '',
          postal_code: '',
        },
        phone: '',
      })
      .then(async (res) => {
        return res.id;
      })
      .catch((error) => {
        console.log(
          `${new Date()} Error when register on the stripe userId=${userId} error=${error} time=${new Date().getTime()} `,
        );
      });

    const attachedData = await this.stripe.paymentMethods
      .attach(paymentMethodId, {
        customer: stripe_customer_id && stripe_customer_id,
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(`Error with attaching payment method ${error}`);
      });

    const customer = (await this.stripe.customers.retrieve(
      stripe_customer_id && stripe_customer_id,
    )) as ICustomer;

    const { default_source } = customer;
    if (paymentMethodId !== default_source) {
      const customer = await this.stripe.customers.update(
        stripe_customer_id && stripe_customer_id,
        {
          invoice_settings: { default_payment_method: paymentMethodId },
        },
      );
    }

    const subscriptionIntent = await this.stripe.subscriptions.create({
      customer: stripe_customer_id && stripe_customer_id,
      items: [
        {
          price: 'price_1NuV5eA5JEtiO6bcWuDti2Dy',
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    // console.log('subscriptionIntent', subscriptionIntent);

    return subscriptionIntent;
  }

  //webHook
  async paymentWebhook(data: Buffer, signature: string) {
    const callbackData = JSON.parse(data.toString());

    const event = this.stripe.webhooks.constructEvent(
      data,
      signature,
      'whsec_FDzJpfYoFeNuHQfuHa2BarRcGJLwbq38',
    );

    console.log(
      'Stripe event',
      event.type,
      'subscription ID',
      callbackData.data.object?.id,
    );
  }

  //cancel memberships
  async cancelMembershipSubscription(id: any) {
    //cancel subscription i <=subscriptions length
    const deleted = await this.stripe.subscriptions.cancel(id);

    if (!deleted) {
      throw new ForbiddenException(`Cannot cancel subscription at this time`);
    } else {
      return true;
    }
  }

  //list all active subscriptions
  async listActiveSubscription() {
    const subscriptions = await this.stripe.subscriptions.list({
      limit: 5,
    });

    return subscriptions;
  }
}
