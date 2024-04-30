import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination-dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Base de datos conectada');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        total: totalPages,
        pages: lastPage,
        lastPage: lastPage,
      },
    };
  }

  findOne(id: number) {
    const product = this.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException(`Error with ${id}`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;

    return this.product.update({
      where: { id }, // Condición para actualizar el producto por su ID
      data: data, // Datos actualizados del producto, y no le mandamos al Id al update
    });
  }

  async remove(id: number) {
    const product = this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
