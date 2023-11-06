import { ProductType } from '../types/productType';
import { Product } from '../models/product';
import * as fs from 'fs';
import * as path from 'path';

export function loadProductCatalogue(): { [sku: string]: Product } {
  const productCataloguePath = path.resolve(__dirname, '..', 'config', 'products.json');
  
  try {
    const fileContent = fs.readFileSync(productCataloguePath, 'utf8');
    const productData: { [key: string]: ProductType } = JSON.parse(fileContent);

    const productCatalogue: { [sku: string]: Product } = {};
    for (const [sku, productInfo] of Object.entries(productData)) {
      if (!productInfo.name || typeof productInfo.price !== 'number') {
        throw new Error(`Product data for SKU "${sku}" is invalid.`);
      }
      productCatalogue[sku] = new Product(sku, productInfo.name, productInfo.price);
    }
    
    return productCatalogue;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse product catalogue file: ${productCataloguePath}`);
    } else {
      throw error;
    }
  }
}
