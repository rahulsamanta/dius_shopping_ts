import { Product } from './product';

// An abstract class that will be the base for all discounts.
export abstract class Discount {
  abstract apply(items: Product[]): number;
}

// A discount that gives one free product for every two purchased.
export class ThreeForTwoDiscount extends Discount {
  constructor(private sku: string) {
    super();
  }

  apply(items: Product[]): number {
    const applicableItems = items.filter(item => item.sku === this.sku);
    const freeItemsCount = Math.floor(applicableItems.length / 3);
    return freeItemsCount * (applicableItems[0]?.price || 0);
  }
}

// A bulk discount where if more than a threshold amount is bought, the price is reduced.
export class BulkDiscount extends Discount {
  constructor(private sku: string, private threshold: number, private discountedPrice: number) {
    super();
  }

  apply(items: Product[]): number {
    const applicableItems = items.filter(item => item.sku === this.sku);

    if (applicableItems.length > this.threshold) {
      const discountPerItem = applicableItems[0].price - this.discountedPrice;
      return discountPerItem * applicableItems.length;
    }
    return 0;
  }
}

// A bundle discount where buying a specific item will include a free item.
export class BundleDiscount extends Discount {
  constructor(private requiredSku: string, private freeSku: string) {
    super();
  }

  apply(items: Product[]): number {
    const requiredItemsCount = items.filter(item => item.sku === this.requiredSku).length;
    const freeItems = items.filter(item => item.sku === this.freeSku);
    const freeItemsCount = Math.min(requiredItemsCount, freeItems.length);
    return freeItemsCount * (freeItems[0]?.price || 0);
  }
}
