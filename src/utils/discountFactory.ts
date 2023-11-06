import { Discount, ThreeForTwoDiscount, BulkDiscount, BundleDiscount } from '../models/discount';
import { DiscountRule, BulkDiscountRule, BundleDiscountRule } from '../types/discountType';

export class DiscountFactory {
  /**
   * Creates a discount instance based on the provided rule.
   * @param {DiscountRule} rule - The discount rule configuration object.
   * @returns {Discount} - An instance of a Discount subclass.
   */
  static createDiscount(rule: DiscountRule): Discount {
    switch (rule.type) {

      case 'ThreeForTwoDiscount':

        if (!('sku' in rule)) {
          throw new Error('ThreeForTwoDiscount requires an "sku" property');
        }
        return new ThreeForTwoDiscount(rule.sku);

      case 'BulkDiscount':
        const bulkRule = rule as BulkDiscountRule;

        if (!('sku' in bulkRule && 'threshold' in bulkRule && 'discountedPrice' in bulkRule)) {
          throw new Error('BulkDiscount requires "sku", "threshold", and "discountedPrice" properties');
        }

        return new BulkDiscount(bulkRule.sku, bulkRule.threshold, bulkRule.discountedPrice);

      case 'BundleDiscount':
        const bundleRule = rule as BundleDiscountRule;

        if (!('sku' in bundleRule && 'freeSku' in bundleRule)) {
          throw new Error('BundleDiscount requires "sku" and "freeSku" properties');
        }

        return new BundleDiscount(bundleRule.sku, bundleRule.freeSku);

      default:
        throw new Error(`Unknown discount type: ${rule.type}`);
    }
  }
}
