import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: { findTypes: jest.Mock; findBrands: jest.Mock };

  beforeEach(async () => {
    service = { findTypes: jest.fn(), findBrands: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [{ provide: CatalogService, useValue: service }],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findTypes délègue au service', async () => {
    const types = [{ id: 1, name: 'Route' }];
    service.findTypes.mockResolvedValue(types);

    await expect(controller.findTypes()).resolves.toBe(types);
  });

  it('findBrands délègue au service', async () => {
    const brands = [{ id: 1, name: 'Trek', models: [] }];
    service.findBrands.mockResolvedValue(brands);

    await expect(controller.findBrands()).resolves.toBe(brands);
  });
});
