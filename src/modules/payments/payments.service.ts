import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';
import { StripeChargeInput } from './dto/stripe-charge.input';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  public async getStripePublishableKey() {
    return this.configService.get('STRIPE_PUBLISHABLE_KEY');
  }

  public async createStripeCustomer(
    name: string,
    email: string,
    type: 'customer' | 'owner',
  ) {
    if (type !== 'customer') return;

    return this.stripe.customers.create({
      name,
      email,
    });
  }

  public async deleteStripeCustomer(stripeCustomerId: string) {
    return this.stripe.customers.del(stripeCustomerId);
  }

  public async stripeCharge(
    stripeCustomerId: string,
    stripeChargeInput: StripeChargeInput,
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: stripeChargeInput.amount * 100,
      customer: stripeCustomerId,
      payment_method_types: stripeChargeInput.paymentMethodTypes,
      currency: stripeChargeInput.currency,
    });

    return paymentIntent.client_secret;
  }

  public async cancelStripeCharge(paymentIntentId: string) {
    return this.stripe.paymentIntents.cancel(paymentIntentId);
  }
}
