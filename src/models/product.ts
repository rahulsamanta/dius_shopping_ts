export class Product {
  sku: string;
  name: string;
  price: number;

  /**
   * Construct a new Product instance.
   * @param {string} sku - The stock-keeping unit identifier for the product.
   * @param {string} name - The name of the product.
   * @param {number} price - The price of the product.
   */
  constructor(sku: string, name: string, price: number) {
    this.sku = sku;
    this.name = name;
    this.price = price;
  }
}
