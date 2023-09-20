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
    //generate access token
    const accessToken = await this.generateAccessToken();

    try {
      const response = await fetch(
        'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        {
          //https://developer.paypal.com/docs/api/orders/v2/#orders_create
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': Date.now().toString(),
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
              {
                // reference_id: 'd9f80740-38f0-11e8-b467-0ed5f89f718b',
                amount: { currency_code: 'USD', value: '70.00' },
              },
            ],
          }),
        },
      );
      return response.json();
    } catch (error) {
      return error;
    }
  }

  //create payment
  async createPayment(id: any): Promise<any> {
    //generate access token
    const accessToken = await this.generateAccessToken();

    try {
      fetch(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}/capture`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': '123e4567-e89b-12d3-a456-426655440010',
          },
          body: JSON.stringify({
            // reference_id: 'd9f80740-38f0-11e8-b467-0ed5f89f718b',
            amount: { currency_code: 'USD', value: '70.00' },
          }),
        },
      )
        .then((res) => res.json())
        .then((json) => {
          // res.send(json);

          console.log('createPayment', json);
          return json;
        });
    } catch (error) {
      return error;
    }
  }

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

  async SubscriptionWebHookCallBack(headers: any) {
    console.log('headers', headers);

    const accessToken = await this.generateAccessToken();
    const callBack_data = {
      transmission_id: headers.transmission_id,
      transmission_time: headers.transmission_time,
      cert_url: headers.cert_url,
      auth_algo: headers.auth_algo,
      transmission_sig: headers.transmission_sig,
      webhook_id: `${this.configService.get<string>('PAYPAL_WEBHOOK_ID')}`,
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
        console.log('res', res.data);
        if (res.data.verification_status == 'SUCCESS') {
          const subs = await headers.body.resource.subscriber;
          if (headers.body.event_type === 'CHECKOUT.ORDER.COMPLETED') {
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
