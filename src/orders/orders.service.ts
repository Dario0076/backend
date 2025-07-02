import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    let total = 0;
    const orderDetails: Array<{
      productId: string;
      quantity: number;
      price: number;
      subtotal: number;
    }> = [];

    // Verificar productos y calcular total
    for (const detail of createOrderDto.orderDetails) {
      const product = await this.productsService.findOne(detail.productId);
      
      if (product.stock < detail.quantity) {
        throw new BadRequestException(`Stock insuficiente para el producto ${product.name}`);
      }

      const subtotal = product.price * detail.quantity;
      total += subtotal;

      orderDetails.push({
        productId: detail.productId,
        quantity: detail.quantity,
        price: product.price,
        subtotal,
      });
    }

    // Crear la orden en una transacción
    return this.prisma.$transaction(async (prisma) => {
      // Crear la orden
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          notes: createOrderDto.notes,
        },
      });

      // Crear los detalles de la orden
      await prisma.orderDetail.createMany({
        data: orderDetails.map(detail => ({
          orderId: order.id,
          productId: detail.productId,
          quantity: detail.quantity,
          price: detail.price,
          subtotal: detail.subtotal,
        })),
      });

      // Actualizar el stock de los productos
      for (const detail of createOrderDto.orderDetails) {
        await this.productsService.updateStock(detail.productId, detail.quantity);
      }

      // Retornar la orden completa
      return prisma.order.findUnique({
        where: { id: order.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async findAll(userId?: string) {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        orderDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        orderDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        orderDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async cancel(id: string, userId?: string) {
    const order = await this.findOne(id);

    if (userId && order.userId !== userId) {
      throw new BadRequestException('No tienes permiso para cancelar esta orden');
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw new BadRequestException('No se puede cancelar una orden que ya está en preparación o enviada');
    }

    // Restaurar el stock de los productos
    await this.prisma.$transaction(async (prisma) => {
      for (const detail of order.orderDetails) {
        await prisma.product.update({
          where: { id: detail.productId },
          data: { stock: { increment: detail.quantity } },
        });
      }

      await prisma.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    });

    return this.findOne(id);
  }
}
