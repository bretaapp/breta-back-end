import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { StripeChargeInput } from './dto/stripe-charge.input';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stripe-charge')
  stripeCharge(
    @Body('stripeClientId') stripeClientId: string,
    @Body('stripeChargeInput') stripeChargeInput: StripeChargeInput,
  ) {
    return this.paymentsService.stripeCharge(stripeClientId, stripeChargeInput);
  }
}
