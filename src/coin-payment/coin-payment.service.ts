import Coinpayments from 'coinpayments';
import { createHmac } from 'crypto';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class CoinPaymentService {
  constructor() {
    this.client = new Coinpayments({
      key: 'fe2366da5fd0461da24695532e4d0555d84914e1c736ef95c60f7bde3b585c18',
      secret:
        'f0BD658b2053c35E09e4a16B15057B6b7d042440ddBFde17E0A9B81f968DEF5b',
    });
  }
  private client: Coinpayments;

  //create coin-payment txn
  async createCoinPayment(body: any): Promise<any> {
    const { currency, amount, email } = body;

    const createPaymentDetails = await this.client
      .createTransaction({
        currency1: 'USD',
        currency2: currency, //    ETH = "ETH", BTC = "BTC", LTC = "LTC", LTCT = "LTCT" use LTCT for lite coin app
        amount: amount,
        buyer_email: email,
        buyer_name: email,
        custom: 'up.railway.app',
        ipn_url: `https://paypal-testing-backend-production.up.railway.app/coin-payment/coin-payment-webhook`,
      })
      .then(async (res) => {
        return res;
      })
      .catch(async (error) => {
        throw error;
      });

    return createPaymentDetails;
  }

  async handleCallBackdetails(callBackData: any, hash: any) {
    const hmac = createHmac('sha512', '12345'); //12345 is the secret
    const _data = new URLSearchParams(callBackData).toString();
    let data = hmac.update(_data);
    let signature = data.digest('hex');
    if (signature !== hash) {
      throw new ForbiddenException('cannot continue your request');
    }

    console.log('coinPayments callBackData.status', callBackData.status);

    //pending
    if (callBackData.status === '0') {
    }
    //funds sent
    if (callBackData.status === '1') {
    }
    //completed
    if (callBackData.status === '100' || callBackData.status === '2') {
      //canceled
      if (
        Math.sign(+callBackData.status) === +'-1' ||
        Number.isNaN(Math.sign(+callBackData.status))
      ) {
      } else {
        throw new ForbiddenException({
          message: 'Nothing happened',
          status: 403,
        });
      }
    }
  }
}
