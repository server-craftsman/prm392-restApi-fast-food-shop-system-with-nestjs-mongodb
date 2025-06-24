import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from './infrastructure/persistence/order.repository';
// import { OrdersDocumentRepository } from './infrastructure/persistence/document/repositories/orders.repository';
import { CartItemsService } from '../cart-items/cart-items.service';
import { ProductRepository } from 'src/products/infrastructure/persistence/product.repository';
import { Order } from './domain/order';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateCustomOrderDto } from './dto/create-custom-order.dto';
import { CreateCustomOrderFromCartDto } from './dto/create-custom-order-from-cart.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// import { QueryOrderDto } from './dto/query-order.dto';
import { OrderItems } from './domain/order';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    // private readonly orderDetailRepository: OrdersDocumentRepository,
    private readonly cartItemsService: CartItemsService,
    private readonly productRepository: ProductRepository,
  ) {}

  async findAll(/*query?: QueryOrderDto*/): Promise<Order[]> {
    // To enable advanced querying, implement logic here
    return this.orderRepository.findAll();
  }

  async myOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async create(userId: string, data: CreateOrderDto): Promise<Order> {
    // Fetch cart by cartId
    const cart = await this.cartItemsService.getCartById(data.cartId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty or not found.');
    }
    let total = 0;
    const items: OrderItems[] = [];
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found.`,
        );
      }
      const price = product.price;
      total += price * item.quantity;

      items.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: price,
      });
    }
    const orderData: Omit<
      Order,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > = {
      cartId: data.cartId,
      userId,
      items,
      total,
      status: OrderStatus.PENDING,
    };
    return this.orderRepository.create(userId, orderData);
  }

  async createCustomOrder(
    userId: string,
    data: CreateCustomOrderDto,
  ): Promise<Order> {
    // Fetch cart by cartId
    const cart = await this.cartItemsService.getCartById(data.cartId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty or not found.');
    }

    if (!data.productIds || data.productIds.length === 0) {
      throw new BadRequestException('At least one product ID is required.');
    }

    let orderTotal = 0;
    const orderItems: OrderItems[] = [];

    // Process each product ID
    for (const productId of data.productIds) {
      // Find the specific product in cart
      const cartItem = cart.items.find((item) => item.productId === productId);
      if (!cartItem) {
        throw new BadRequestException(
          `Product with ID ${productId} not found in cart.`,
        );
      }

      // Get product details
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      const productPrice = product.price;
      const itemTotal = productPrice * cartItem.quantity;
      orderTotal += itemTotal;

      orderItems.push({
        productId: productId,
        productName: product.name,
        quantity: cartItem.quantity,
        price: productPrice,
      });
    }

    const customOrderData: Omit<
      Order,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > = {
      cartId: data.cartId,
      userId,
      items: orderItems,
      total: orderTotal,
      status: OrderStatus.PENDING,
      notes: data.notes,
    };

    return this.orderRepository.create(userId, customOrderData);
  }

  async createCustomOrderFromCart(
    userId: string,
    data: CreateCustomOrderFromCartDto,
  ): Promise<Order> {
    // Get cart items first
    const cart = await this.cartItemsService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    let total = 0;
    const items: OrderItems[] = [];

    // Add cart items to order
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found.`,
        );
      }
      const price = product.price;
      total += price * item.quantity;

      items.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: price,
      });
    }

    // Add custom items to order
    for (const item of data.items) {
      // Validate product if productId is provided
      if (item.productId) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found.`,
          );
        }
        // Use product price if not provided in custom order
        const price = item.price || product.price;
        total += price * item.quantity;

        items.push({
          productId: item.productId,
          productName: item.productName || product.name,
          quantity: item.quantity,
          price: price,
          notes: item.notes,
        });
      } else {
        // Custom product without productId
        total += item.price * item.quantity;

        items.push({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        });
      }
    }

    const orderData: Omit<
      Order,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > = {
      cartId: cart.id,
      userId,
      items,
      total,
      status: OrderStatus.PENDING,
      notes: data.notes,
    };

    const newOrder = await this.orderRepository.create(userId, orderData);

    // Clear the cart after creating the order
    await this.cartItemsService.clearCart(userId);

    return newOrder;
  }

  async update(
    userId: string,
    id: string,
    data: UpdateOrderDto,
  ): Promise<Order> {
    // Only allow updating cartId and userId
    const updateData: any = {};
    if (data.cartId) updateData.cartId = data.cartId;
    const updated = await this.orderRepository.update(userId, id, updateData);
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.orderRepository.delete(userId, id);
  }

  async createFromCart(userId: string): Promise<Order> {
    const cart = await this.cartItemsService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    let total = 0;
    const items: OrderItems[] = [];
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found.`,
        );
      }
      const price = product.price;
      total += price * item.quantity;
      const orderItem: OrderItems = {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: price,
      };
      items.push(orderItem);
    }

    const orderData: Omit<
      Order,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > = {
      cartId: cart.id,
      userId,
      items,
      total,
      status: OrderStatus.PENDING,
    };
    const newOrder = await this.orderRepository.create(userId, orderData);

    await this.cartItemsService.clearCart(userId);
    return newOrder;
  }

  async cancelOrder(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order is already completed');
    }

    return this.orderRepository.update(userId, orderId, {
      status: OrderStatus.CANCELLED,
    });
  }
}
