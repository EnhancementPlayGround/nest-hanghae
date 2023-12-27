import { ProductService } from '@/application/products/product.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ProductQueryDto } from './dto/product.query';

@Controller('products')
export default class ProductController {
  constructor(private readonly productSvc: ProductService) {}

  @Get()
  async getProductInfo(@Query() queryDto: ProductQueryDto) {
    return await this.productSvc.findProductsByPage(queryDto);
  }
}
