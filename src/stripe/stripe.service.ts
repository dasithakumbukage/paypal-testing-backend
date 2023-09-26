import { Injectable } from '@nestjs/common';
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
  async paymentWebhook(data: Buffer, sig: string) {
    console.log('paymentWebhook body', data, 'signature', sig);

    const event = this.stripe.webhooks.constructEvent(
      JSON.stringify(data, null, 2),
      sig,
      'whsec_psJrx9neB53UOXHiOjbemvta5CsZ9Y5l',
    );

    console.log('event', event);
  }
}
