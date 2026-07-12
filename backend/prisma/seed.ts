import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Keyboard',
        sku: 'KEY-001',
        price: 79.99,
        stockQuantity: 10,
        category: 'Accessories',
      },
      {
        name: 'Wireless Mouse',
        sku: 'MOUSE-001',
        price: 29.99,
        stockQuantity: 15,
        category: 'Accessories',
      },
      {
        name: 'USB-C Cable',
        sku: 'CABLE-001',
        price: 9.99,
        stockQuantity: 30,
        category: 'Cables',
      },
      {
        name: 'Laptop Stand',
        sku: 'STAND-001',
        price: 39.99,
        stockQuantity: 8,
        category: 'Office',
      },
    ],
  });

  console.log('db seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
