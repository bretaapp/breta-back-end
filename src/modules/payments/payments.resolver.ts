import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { Payment } from './entities/payment.entity';

import { PaymentsService } from './payments.service';

import { StripeChargeInput } from './dto/stripe-charge.input';

import GraphQLJSON from 'graphql-type-json';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => String)
  stripePublishableKey() {
    return this.paymentsService.getStripePublishableKey();
  }

  @Mutation(() => String)
  clientSecret(
    @Args('stripe_customer_id') stripeCustomerId: string,
    @Args('stripeChargeInput') stripeChargeInput: StripeChargeInput,
  ) {
    return this.paymentsService.stripeCharge(
      stripeCustomerId,
      stripeChargeInput,
    );
  }

  @Mutation(() => GraphQLJSON)
  cancelStripeCharge(@Args('paymentIntentId') paymentIntentId: string) {
    return this.paymentsService.cancelStripeCharge(paymentIntentId);
  }
}
