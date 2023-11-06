import { Discount } from './discount';
import { Product } from './product';
import { loadProductCatalogue } from '../utils/productCatalogueLoader';

export class Checkout {
  private items: Product[] = [];
  private productCatalogue: { [sku: string]: Product };

  constructor(private pricingRules: Discount[]) {
    this.productCatalogue = loadProductCatalogue();
  }

  // Scans a product by its SKU and adds it to the checkout items.
  scan(sku: string): void {
    const product = this.productCatalogue[sku];

    if (!product) {
      throw new Error(`Product with SKU '${sku}' not found.`);
    }
    this.items.push(product);
  }

  // Calculates the total price for all scanned items, applying any discounts.
  total(): number {
    let totalPrice = this.items.reduce((total, item) => total + item.price, 0);

    for (const rule of this.pricingRules) {
      totalPrice -= rule.apply(this.items);
    }

    return totalPrice;
  }

  // Clears all items from the checkout, resetting it for a new customer.
  clear(): void {
    this.items = [];
  }
}
