import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { toJSON } from 'flatted';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class PaypalService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  //create order
  async createOrder(): Promise<any> {
    const accessToken = await this.generateAccessToken();

    try {
      const createOrder = this.httpService.post(
        'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: { currency_code: 'USD', value: '70.00' },
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': Date.now().toString(),
          },
        },
      );

      const createOrderResponse = await firstValueFrom(createOrder);
      if (!createOrderResponse.data) return;
      console.log('createOrder', createOrderResponse.data);
      return createOrderResponse.data;
    } catch (error) {
      return error;
    }
  }

  //create onetime payment
  async approveOrder(id: any): Promise<any> {
    const accessToken = await this.generateAccessToken();

    try {
      const approveOrder = this.httpService.post(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}/capture`,
        {
          amount: { currency_code: 'USD', value: '70.00' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': Date.now().toString(),
          },
        },
      );

      const approveOrderResponse = await firstValueFrom(approveOrder);
      if (!approveOrderResponse.data) return;
      console.log('approveOrder', approveOrderResponse.data);
      return approveOrderResponse.data;
    } catch (error) {
      return error;
    }
  }

  //create subscription
  async createSubscriptionPayment() {
    try {
      const accessToken = await this.generateAccessToken();

      const createSubscription = this.httpService.post(
        'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
        {
          plan_id: 'P-0VL4687953917625XMUF66EQ',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const createSubscriptionResponse =
        await firstValueFrom(createSubscription);

      if (!createSubscriptionResponse.data.id) return;

      console.log('createSubscriptionPayment', createSubscriptionResponse.data);

      return createSubscriptionResponse.data.id;
    } catch (error) {
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }

  //cancel subscription
  async cancelSubscription(subscription_id: any) {
    try {
      const accessToken = await this.generateAccessToken();

      const cancelSubscription = this.httpService.post(
        `https://api-m.paypal.com/v1/billing/subscriptions/${subscription_id}/cancel`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const cancelSubscriptionResponse =
        await firstValueFrom(cancelSubscription);

      if (!cancelSubscriptionResponse.data.id) return;

      console.log('cancelSubscriptionPayment', cancelSubscriptionResponse.data);

      return cancelSubscriptionResponse.data.id;
    } catch (error) {
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }

  //check subscription
  async checkSubscriptionPayment(subscription_id: any) {
    const accessToken = await this.generateAccessToken();
    try {
      const createSubscription = this.httpService.get(
        `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscription_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const response = await firstValueFrom(createSubscription);
      console.log('checkSubscriptionPayment', response.data);

      return response.data;
    } catch (error) {
      // this.logger.error(
      //   `Cannot create subscription: userId=${userId} time=${new Date().getTime()} ${error}`,
      // );
      return error;
    }
  }

  //generate the token
  async generateAccessToken() {
    try {
      const token = `${this.configService.get<string>(
        'PAYPAL_CLIENT_ID',
      )}:${this.configService.get<string>('PAYPAL_CLIENT_SECRET')}`;
      const encodedToken = Buffer.from(token).toString('base64');
      const res = this.httpService.post(
        `${this.configService.get<string>('PAYPAL_BASE_URL')}/v1/oauth2/token`,
        { grant_type: 'client_credentials' },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedToken}`,
          },
        },
      );
      const response = await firstValueFrom(res).catch((error) => error);
      return toJSON(response.data.access_token);
    } catch (error) {
      return error;
    }
  }

  //webHook
  async SubscriptionWebHookCallBack(headers: any) {
    const accessToken = await this.generateAccessToken();
    const callBack_data = {
      transmission_id: headers.transmission_id,
      transmission_time: headers.transmission_time,
      cert_url: headers.cert_url,
      auth_algo: headers.auth_algo,
      transmission_sig: headers.transmission_sig,
      webhook_id: `2LW44515CL2593728`,
      webhook_event: headers.body,
    };
    const actualData = JSON.stringify(callBack_data);
    firstValueFrom(
      this.httpService.post(
        `${this.configService.get<string>(
          'PAYPAL_BASE_URL',
        )}/v1/notifications/verify-webhook-signature`,
        actualData,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    )
      .then(async (res) => {
        if (res.data.verification_status == 'SUCCESS') {
          const subs = await headers.body.resource.subscriber;
          //onetime
          if (headers.body.event_type === 'CHECKOUT.ORDER.APPROVED') {
          }
          if (
            headers.body.event_type === 'CHECKOUT.PAYMENT-APPROVAL.REVERSED'
          ) {
          }
          if (headers.body.event_type === 'CHECKOUT.ORDER.COMPLETED') {
          }
          //subscription
          if (headers.body.event_type === 'BILLING.SUBSCRIPTION.CREATED') {
          }
          if (headers.body.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
          }
          if (headers.body.event_type === 'BILLING.SUBSCRIPTION.UPDATED') {
          }
          if (headers.body.event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
          }
          if (headers.body.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
          }
          if (headers.body.event_type === 'BILLING.SUBSCRIPTION.SUSPENDED') {
          }
          if (
            headers.body.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.FAILED'
          ) {
          }
        } else {
          // this.logger.log(
          //   `getSubscriptionWebHookCallBack: Invalid signature ${
          //     headers.signature
          //   } time=${new Date().getTime()}`,
          // );
          throw new ForbiddenException('Verification failed');
        }
      })
      .catch((error) => {
        // this.logger.error(
        //   `getSubscriptionWebHookCallBack:  ${error} time=${new Date().getTime()}`,
        // );
        return error;
      });
  }
}
