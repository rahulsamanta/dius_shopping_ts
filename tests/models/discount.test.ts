import { ThreeForTwoDiscount, BulkDiscount, BundleDiscount } from '../../src/models/discount';
import { Product } from '../../src/models/product';

describe('Discounts', () => {
  const products: { [sku: string]: Product } = {
    'atv': new Product('atv', 'Apple TV', 109.50),
    'ipd': new Product('ipd', 'Super iPad', 549.99),
    'mbp': new Product('mbp', 'MacBook Pro', 1399.99),
    'vga': new Product('vga', 'VGA adapter', 30.00)
  };

  describe('ThreeForTwoDiscount', () => {
    const discount = new ThreeForTwoDiscount('atv');

    test('apply a 3 for 2 discount correctly', () => {
      const items = [products['atv'], products['atv'], products['atv']];
      const discountAmount = discount.apply(items);
      expect(discountAmount).toBe(products['atv'].price);
    });

    test('should not apply discount for less than 3 items', () => {
      const items = [products['atv'], products['atv']];
      const discountAmount = discount.apply(items);
      expect(discountAmount).toBe(0);
    });
  });

  describe('BulkDiscount', () => {
    const discount = new BulkDiscount('ipd', 4, 499.99);

    test('apply bulk discount when quantity exceeds threshold', () => {
      const items = [products['ipd'], products['ipd'], products['ipd'], products['ipd'], products['ipd']];
      const discountAmount = discount.apply(items);
      const expectedDiscount = (products['ipd'].price - 499.99) * items.length;
      expect(discountAmount).toBe(expectedDiscount);
    });

    test('should not apply bulk discount when quantity is below threshold', () => {
      const items = [products['ipd'], products['ipd'], products['ipd'], products['ipd']];
      const discountAmount = discount.apply(items);
      expect(discountAmount).toBe(0);
    });
  });

  describe('BundleDiscount', () => {
    const discount = new BundleDiscount('mbp', 'vga');

    test('bundle a free VGA adapter with every MacBook Pro', () => {
      const items = [products['mbp'], products['vga']];
      const discountAmount = discount.apply(items);
      expect(discountAmount).toBe(products['vga'].price);
    });

    test('should not give more free VGAs than MacBook Pros', () => {
      const items = [products['mbp'], products['vga'], products['vga']];
      const discountAmount = discount.apply(items);
      expect(discountAmount).toBe(products['vga'].price);
    });

    test('should not apply bundle discount when no MacBook Pro is bought', () => {
      const items = [products['vga']];
      const discountAmount = discount.apply(items);
      expect(discountAmount).toBe(0);
    });
  });
});
