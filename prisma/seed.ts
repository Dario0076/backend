import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  // Limpiar datos existentes
  await prisma.orderDetail.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password: adminPassword,
      name: 'Administrador',
      phone: '+34 666 777 888',
      address: 'Calle Admin 123',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@user.com',
      password: userPassword,
      name: 'Usuario Demo',
      phone: '+34 666 123 456',
      address: 'Calle Usuario 456',
      role: 'USER',
    },
  });

  console.log('✅ Usuarios creados');

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electrónicos',
        description: 'Dispositivos electrónicos y gadgets',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ropa',
        description: 'Prendas de vestir y accesorios',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hogar',
        description: 'Artículos para el hogar y decoración',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Libros',
        description: 'Libros y material educativo',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Deportes',
        description: 'Artículos deportivos y fitness',
      },
    }),
  ]);

  console.log('✅ Categorías creadas');

  // Crear productos
  const products = await Promise.all([
    // Electrónicos
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description: 'Smartphone Apple con chip A17 Pro',
        price: 999.99,
        stock: 50,
        imageUrl: 'https://example.com/iphone15.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'MacBook Air M2',
        description: 'Laptop ultraligera con chip M2',
        price: 1299.99,
        stock: 25,
        imageUrl: 'https://example.com/macbook.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'AirPods Pro',
        description: 'Auriculares inalámbricos con cancelación de ruido',
        price: 249.99,
        stock: 100,
        imageUrl: 'https://example.com/airpods.jpg',
        categoryId: categories[0].id,
      },
    }),

    // Ropa
    prisma.product.create({
      data: {
        name: 'Camiseta Básica',
        description: 'Camiseta de algodón 100% en varios colores',
        price: 19.99,
        stock: 200,
        imageUrl: 'https://example.com/camiseta.jpg',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Jeans Slim Fit',
        description: 'Pantalones vaqueros de corte slim',
        price: 69.99,
        stock: 80,
        imageUrl: 'https://example.com/jeans.jpg',
        categoryId: categories[1].id,
      },
    }),

    // Hogar
    prisma.product.create({
      data: {
        name: 'Lámpara LED',
        description: 'Lámpara de mesa con regulador de intensidad',
        price: 39.99,
        stock: 60,
        imageUrl: 'https://example.com/lampara.jpg',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cojín Decorativo',
        description: 'Cojín suave para sofá en varios diseños',
        price: 15.99,
        stock: 150,
        imageUrl: 'https://example.com/cojin.jpg',
        categoryId: categories[2].id,
      },
    }),

    // Libros
    prisma.product.create({
      data: {
        name: 'El Quijote',
        description: 'Clásico de la literatura española',
        price: 12.99,
        stock: 40,
        imageUrl: 'https://example.com/quijote.jpg',
        categoryId: categories[3].id,
      },
    }),

    // Deportes
    prisma.product.create({
      data: {
        name: 'Pelota de Fútbol',
        description: 'Pelota oficial reglamentaria',
        price: 29.99,
        stock: 75,
        imageUrl: 'https://example.com/pelota.jpg',
        categoryId: categories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mancuernas 5kg',
        description: 'Par de mancuernas de 5kg cada una',
        price: 49.99,
        stock: 30,
        imageUrl: 'https://example.com/mancuernas.jpg',
        categoryId: categories[4].id,
      },
    }),
  ]);

  console.log('✅ Productos creados');

  // Crear algunos pedidos de ejemplo
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      total: 1069.97,
      status: 'DELIVERED',
      notes: 'Entrega en horario de oficina',
    },
  });

  await prisma.orderDetail.createMany({
    data: [
      {
        orderId: order1.id,
        productId: products[0].id, // iPhone
        quantity: 1,
        price: 999.99,
        subtotal: 999.99,
      },
      {
        orderId: order1.id,
        productId: products[3].id, // Camiseta
        quantity: 2,
        price: 19.99,
        subtotal: 39.98,
      },
      {
        orderId: order1.id,
        productId: products[5].id, // Lámpara
        quantity: 1,
        price: 39.99,
        subtotal: 39.99,
      },
    ],
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      total: 89.98,
      status: 'PREPARING',
      notes: 'Llamar antes de entregar',
    },
  });

  await prisma.orderDetail.createMany({
    data: [
      {
        orderId: order2.id,
        productId: products[4].id, // Jeans
        quantity: 1,
        price: 69.99,
        subtotal: 69.99,
      },
      {
        orderId: order2.id,
        productId: products[3].id, // Camiseta
        quantity: 1,
        price: 19.99,
        subtotal: 19.99,
      },
    ],
  });

  console.log('✅ Pedidos de ejemplo creados');

  console.log('🎉 Seeding completado!');
  console.log('\n📧 Credenciales de prueba:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Usuario: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
