import * as fs from 'fs';
import * as path from 'path';
import { loadProductCatalogue } from '../../src/utils/productCatalogueLoader';
import { Product } from '../../src/models/product';

jest.mock('fs');
jest.mock('path');

describe('productCatalogueLoader', () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock;
  const mockResolve = path.resolve as jest.Mock;

  beforeEach(() => {
    mockResolve.mockReturnValue('dummyPath/products.json');
  });

  test('load product catalogue and return a dictionary of Product instances', () => {
    const mockProductCatalogueJson = JSON.stringify({
      'atv': { 'name': 'Apple TV', 'price': 109.50 },
      'ipd': { 'name': 'Super iPad', 'price': 549.99 }
    });
    mockReadFileSync.mockReturnValue(mockProductCatalogueJson);

    const productCatalogue = loadProductCatalogue();
    expect(productCatalogue).toBeInstanceOf(Object);
    expect(productCatalogue['atv']).toBeInstanceOf(Product);
    expect(productCatalogue['ipd']).toBeInstanceOf(Product);
    expect(productCatalogue['atv'].price).toEqual(109.50);
    expect(productCatalogue['ipd'].name).toEqual('Super iPad');
  });

  test('throw an error if product catalogue file does not exist', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(loadProductCatalogue).toThrow('File not found');
  });

  test('throw an error if product catalogue contains invalid JSON', () => {
    mockReadFileSync.mockReturnValue('invalid JSON');

    expect(loadProductCatalogue).toThrow('Failed to parse product catalogue file');
  });

  test('throw an error if product data is invalid', () => {
    const mockInvalidProductDataJson = JSON.stringify({
      'atv': { 'name': 'Apple TV' }
    });
    mockReadFileSync.mockReturnValue(mockInvalidProductDataJson);

    expect(loadProductCatalogue).toThrow('Product data for SKU "atv" is invalid.');
  });
});
