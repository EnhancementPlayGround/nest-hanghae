import { ProductService } from '@/products/service/product.service';
import { Get, Injectable, Query } from '@nestjs/common';
import { ProductQueryDto } from './dto/product.query';

@Injectable()
export default class ProductController {
  constructor(private readonly productSvc: ProductService) {}

  @Get()
  async getProductInfo(@Query() queryDto: ProductQueryDto) {
    return await this.productSvc.findProductsByPage(queryDto);
  }
}
