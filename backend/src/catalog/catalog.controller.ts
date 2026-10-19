import { Controller } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('bike-types')
  findTypes() {
    return this.catalogService.findTypes();
  }

  @Get('bike-brands')
  findBrands() {
    return this.catalogService.findBrands();
  }
}
