// Define a type for the different discount strategies.
export type DiscountStrategy = 'ThreeForTwoDiscount' | 'BulkDiscount' | 'BundleDiscount';

// Define a base interface for discount rules that extends to other Discount classes.
export interface DiscountRule {
  type: DiscountStrategy;
  sku: string;
}

export interface BulkDiscountRule extends DiscountRule {
  threshold: number;
  discountedPrice: number;
}

export interface BundleDiscountRule extends DiscountRule {
  freeSku: string;
}
