import { DiscountFactory } from '../../src/utils/discountFactory';
import { ThreeForTwoDiscount, BulkDiscount, BundleDiscount } from '../../src/models/discount';
import { DiscountRule, BulkDiscountRule, BundleDiscountRule } from '../../src/types/discountType';

describe('DiscountFactory', () => {
  describe('createDiscount', () => {
    test('create a ThreeForTwoDiscount instance', () => {
      const rule: DiscountRule = {
        type: 'ThreeForTwoDiscount',
        sku: 'atv'
      };
      const discount = DiscountFactory.createDiscount(rule);
      expect(discount).toBeInstanceOf(ThreeForTwoDiscount);
      expect((discount as ThreeForTwoDiscount).sku).toBe('atv');
    });

    test('create a BulkDiscount instance', () => {
      const rule: BulkDiscountRule = {
        type: 'BulkDiscount',
        sku: 'ipd',
        threshold: 4,
        discountedPrice: 499.99
      };
      const discount = DiscountFactory.createDiscount(rule);
      expect(discount).toBeInstanceOf(BulkDiscount);
      expect((discount as BulkDiscount).sku).toBe('ipd');
      expect((discount as BulkDiscount).threshold).toBe(4);
      expect((discount as BulkDiscount).discountedPrice).toBe(499.99);
    });

    test('create a BundleDiscount instance', () => {
      const rule: BundleDiscountRule = {
        type: 'BundleDiscount',
        sku: 'mbp',
        freeSku: 'vga'
      };
      const discount = DiscountFactory.createDiscount(rule);
      expect(discount).toBeInstanceOf(BundleDiscount);
      expect((discount as BundleDiscount).requiredSku).toBe('mbp');
      expect((discount as BundleDiscount).freeSku).toBe('vga');
    });

    test('throw an error for unknown discount type', () => {
      const rule = {
        type: 'UnknownDiscount',
        sku: 'xyz'
      } as DiscountRule;
      expect(() => DiscountFactory.createDiscount(rule)).toThrow(
        'Unknown discount type: UnknownDiscount');
    });

    test('throw an error for invalid ThreeForTwoDiscount rule', () => {
      const rule = {
        type: 'ThreeForTwoDiscount'
      } as DiscountRule;
      expect(() => DiscountFactory.createDiscount(rule)).toThrow(
        'ThreeForTwoDiscount requires an "sku" property');
    });

    test('throw an error for invalid BulkDiscount rule', () => {
      const rule = {
        type: 'BulkDiscount',
        sku: 'ipd',
      } as BulkDiscountRule;
      expect(() => DiscountFactory.createDiscount(rule)).toThrow(
        'BulkDiscount requires "sku", "threshold", and "discountedPrice" properties');
    });

    test('throw an error for invalid BundleDiscount rule', () => {
      const rule = {
        type: 'BundleDiscount',
        sku: 'mbp',
      } as BundleDiscountRule;
      expect(() => DiscountFactory.createDiscount(rule)).toThrow(
        'BundleDiscount requires "sku" and "freeSku" properties');
    });
  });
});
