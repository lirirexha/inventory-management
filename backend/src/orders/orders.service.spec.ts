import { Prisma } from '@prisma/client';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockPrisma = {
    $transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrdersService(mockPrisma as unknown as PrismaService);
  });

  it('creates an order and decrements stock when stock is available', async () => {
    const product = {
      id: 1,
      name: 'Keyboard',
      price: new Prisma.Decimal(50),
      stockQuantity: 5,
    };

    const tx = {
      product: {
        findUnique: jest.fn().mockResolvedValue(product),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      order: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          total: new Prisma.Decimal(100),
          items: [
            {
              productId: 1,
              quantity: 2,
              unitPrice: new Prisma.Decimal(50),
              lineTotal: new Prisma.Decimal(100),
            },
          ],
        }),
      },
    };

    type MockTransactionClient = typeof tx;

    mockPrisma.$transaction.mockImplementation(
      async <T>(callback: (tx: MockTransactionClient) => Promise<T>) => {
        return callback(tx);
      },
    );

    const result = await service.create({
      items: [
        {
          productId: 1,
          quantity: 2,
        },
      ],
    });

    expect(tx.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(tx.product.updateMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        stockQuantity: {
          gte: 2,
        },
      },
      data: {
        stockQuantity: {
          decrement: 2,
        },
      },
    });

    expect(tx.order.create).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('throws ConflictException when stock is not enough', async () => {
    const product = {
      id: 1,
      name: 'Keyboard',
      price: new Prisma.Decimal(50),
      stockQuantity: 1,
    };

    const tx = {
      product: {
        findUnique: jest.fn().mockResolvedValue(product),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      order: {
        create: jest.fn(),
      },
    };

    type MockTransactionClient = typeof tx;

    mockPrisma.$transaction.mockImplementation(
      async <T>(callback: (tx: MockTransactionClient) => Promise<T>) => {
        return callback(tx);
      },
    );

    await expect(
      service.create({
        items: [
          {
            productId: 1,
            quantity: 5,
          },
        ],
      }),
    ).rejects.toThrow(ConflictException);

    expect(tx.order.create).not.toHaveBeenCalled();
  });
});
