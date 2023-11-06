import * as fs from 'fs';
import * as path from 'path';
import { loadPricingRules } from '../../src/utils/pricingRulesLoader';
import { Discount } from '../../src/models/discount';

jest.mock('fs');
jest.mock('path');

describe('pricingRulesLoader', () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock;
  const mockResolve = path.resolve as jest.Mock;

  beforeEach(() => {
    mockResolve.mockReturnValue('dummyPath/pricingRules.json');
  });

  test('load pricing rules and return Discount array', () => {
    const mockPricingRulesJson = JSON.stringify([
      { type: 'ThreeForTwoDiscount', sku: 'atv' },
      { type: 'BulkDiscount', sku: 'ipd', threshold: 4, discountedPrice: 499.99 },
      { type: 'BundleDiscount', sku: 'mbp', freeSku: 'vga' }
    ]);
    
    mockReadFileSync.mockReturnValue(mockPricingRulesJson);

    const pricingRules = loadPricingRules();
    expect(pricingRules).toBeInstanceOf(Array);
    pricingRules.forEach(rule => {
      expect(rule).toBeInstanceOf(Discount);
    });
  });

  test('throw an error if pricing rules file does not exist', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(loadPricingRules).toThrow('File not found');
  });

  test('throw an error if pricing rules file contains invalid JSON', () => {
    mockReadFileSync.mockReturnValue('invalid JSON');

    expect(loadPricingRules).toThrow('Failed to parse pricing rules file');
  });

  test('throw an error if pricing rules file has invalid structure', () => {
    const mockInvalidStructureJson = JSON.stringify([
      { type: 'InvalidDiscountType', sku: 'unknown' }
    ]);
    mockReadFileSync.mockReturnValue(mockInvalidStructureJson);

    expect(loadPricingRules).toThrow();
  });
});
