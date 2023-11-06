import { Checkout } from '../../src/models/checkout';
import { Discount } from '../../src/models/discount';
import { ThreeForTwoDiscount, BulkDiscount, BundleDiscount } from '../../src/models/discount';
import { loadPricingRules } from '../../src/utils/pricingRulesLoader';
import { loadProductCatalogue } from '../../src/utils/productCatalogueLoader';
import { Product } from '../../src/models/product';

jest.mock('../../src/utils/pricingRulesLoader', () => ({
  loadPricingRules: jest.fn(),
}));
jest.mock('../../src/utils/productCatalogueLoader', () => ({
  loadProductCatalogue: jest.fn(),
}));

describe('Checkout Integration', () => {
  const mockPricingRules: Discount[] = [
    new ThreeForTwoDiscount('atv'),
    new BulkDiscount('ipd', 4, 499.99),
    new BundleDiscount('mbp', 'vga')
  ];

  const mockProductCatalogue = {
    'atv': new Product('atv', 'Apple TV', 109.50),
    'ipd': new Product('ipd', 'Super iPad', 549.99),
    'mbp': new Product('mbp', 'MacBook Pro', 1399.99),
    'vga': new Product('vga', 'VGA adapter', 30.00)
  };

  beforeEach(() => {
    (loadPricingRules as jest.Mock).mockReturnValue(mockPricingRules);
    (loadProductCatalogue as jest.Mock).mockReturnValue(mockProductCatalogue);
  });

  test('calculate the total price correctly when multiple discounts apply', () => {
    const co = new Checkout(mockPricingRules);
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');
    co.scan('vga');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('mbp');

    const expectedTotal =
      3 * mockProductCatalogue['atv'].price - mockProductCatalogue['atv'].price +
      5 * 499.99 + mockProductCatalogue['mbp'].price;

    expect(co.total()).toEqual(expectedTotal);
  });

  test('calculate the total price correctly with no discounts', () => {
    const co = new Checkout(mockPricingRules);
    co.scan('vga');
    co.scan('vga');

    const expectedTotal = 2 * mockProductCatalogue['vga'].price;

    expect(co.total()).toEqual(expectedTotal);
  });

  test('handle scanning an unknown product', () => {
    const co = new Checkout(mockPricingRules);
    expect(() => co.scan('blah')).toThrow('Product with SKU \'blah\' not found.');
  });
});
