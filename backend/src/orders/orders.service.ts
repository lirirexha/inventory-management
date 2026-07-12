import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const items = createOrderDto.items;

    return this.prisma.$transaction(async (tx) => {
      const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];
      let orderTotal = new Prisma.Decimal(0);

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(
            `Product with id ${item.productId} does not exist`,
          );
        }

        // This checks and decrements stock in one database operation
        // so two concurrent orders cant both take the last available item
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: {
              gte: item.quantity,
            },
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.count === 0) {
          throw new ConflictException(`No stock for product ${product.name}`);
        }

        const lineTotal = product.price.mul(item.quantity);
        orderTotal = orderTotal.add(lineTotal);

        orderItemsData.push({
          product: {
            connect: {
              id: product.id,
            },
          },
          quantity: item.quantity,
          unitPrice: product.price,
          lineTotal,
        });
      }

      return tx.order.create({
        data: {
          total: orderTotal,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
