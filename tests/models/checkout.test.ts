import { Checkout } from '../../src/models/checkout';
import { Discount } from '../../src/models/discount';
import { Product } from '../../src/models/product';
import { DiscountFactory } from '../../src/utils/discountFactory';

describe('Checkout', () => {
  let checkout: Checkout;
  let pricingRules: Discount[];

  const products: { [sku: string]: Product } = {
    'atv': new Product('atv', 'Apple TV', 109.50),
    'ipd': new Product('ipd', 'Super iPad', 549.99),
    'mbp': new Product('mbp', 'MacBook Pro', 1399.99),
    'vga': new Product('vga', 'VGA adapter', 30.00)
  };

  const loadMockPricingRules = () => {
    return [
      DiscountFactory.createDiscount({ type: 'ThreeForTwoDiscount', sku: 'atv' }),
      DiscountFactory.createDiscount({
        type: 'BulkDiscount',
        sku: 'ipd',
        threshold: 4,
        discountedPrice: 499.99
      }),
      DiscountFactory.createDiscount({ type: 'BundleDiscount', sku: 'mbp', freeSku: 'vga' })
    ];
  };

  beforeEach(() => {
    pricingRules = loadMockPricingRules();
    checkout = new Checkout(pricingRules);
  });

  test('scan products and add them to checkout', () => {
    checkout.scan('atv');
    checkout.scan('ipd');
    expect(checkout.items).toEqual([products['atv'], products['ipd']]);
  });

  test('throw error if an unknown SKU is scanned', () => {
    expect(() => checkout.scan('blah')).toThrow('Product with SKU \'blah\' not found.');
  });

  test('calculate the total with no discounts applied', () => {
    checkout.scan('atv');
    checkout.scan('vga');
    expect(checkout.total()).toBe(products['atv'].price + products['vga'].price);
  });

  test('apply a three for two discount on Apple TVs', () => {
    for (let i = 0; i < 3; i++) {
      checkout.scan('atv');
    }
    expect(checkout.total()).toBe(2 * products['atv'].price);
  });

  test('apply a bulk discount on Super iPads', () => {
    for (let i = 0; i < 5; i++) {
      checkout.scan('ipd');
    }
    expect(checkout.total()).toBe(5 * 499.99);
  });

  test('bundle a VGA adapter free of charge with a MacBook Pro', () => {
    checkout.scan('mbp');
    checkout.scan('vga');
    expect(checkout.total()).toBe(products['mbp'].price);
  });

  test('clear all items from the checkout', () => {
    checkout.scan('mbp');
    checkout.scan('vga');
    checkout.clear();
    expect(checkout.items).toEqual([]);
  });
});
