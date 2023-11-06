import { DiscountRule } from '../types/discountType';
import { DiscountFactory } from './discountFactory';
import { Discount } from '../models/discount';
import * as fs from 'fs';
import * as path from 'path';

export function loadPricingRules(): Discount[] {
  const pricingRulesPath = path.resolve(__dirname, '..', 'config', 'pricingRules.json');

  try {
    const fileContent = fs.readFileSync(pricingRulesPath, 'utf8');
    const rules: DiscountRule[] = JSON.parse(fileContent);

    return rules.map(rule => DiscountFactory.createDiscount(rule));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse pricing rules file: ${pricingRulesPath}`);
    } else {
      throw error;
    }
  }
}
