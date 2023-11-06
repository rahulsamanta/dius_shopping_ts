import { Checkout } from './models/checkout';
import { loadPricingRules } from './utils/pricingRulesLoader';

// Initialize the Checkout system with pricing rules.
export function createCheckout(): Checkout {
  const pricingRules = loadPricingRules();
  const checkout = new Checkout(pricingRules);

  return checkout;
}

// Usage information
if (require.main === module) {
  try {
    const co = createCheckout();
    co.scan('atv');
    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');
    console.log(`Total cart amount: $${co.total()}`);
    co.clear();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error occurred: ${error.message}`);
    } else {
      console.error(`An unexpected error occurred: ${String(error)}`);
    }
  }
}
