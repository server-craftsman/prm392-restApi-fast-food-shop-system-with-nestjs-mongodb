import { Order } from '../../domain/order';

/**
 * Abstract repository for Order domain operations
 */
export abstract class OrderRepository {
  /**
   * Create a new order
   * @param userId - User ID who owns the order
   * @param data - Order data without auto-generated fields
   * @returns Promise<Order> - Created order
   */
  abstract create(
    userId: string,
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Order>;

  /**
   * Update an existing order
   * @param userId - User ID who owns the order
   * @param id - Order ID to update
   * @param data - Partial order data to update
   * @returns Promise<Order> - Updated order
   */
  abstract update(
    userId: string,
    id: Order['id'],
    data: Partial<Order>,
  ): Promise<Order>;

  /**
   * Delete an order
   * @param userId - User ID who owns the order
   * @param id - Order ID to delete
   * @returns Promise<void>
   */
  abstract delete(userId: string, id: Order['id']): Promise<void>;

  /**
   * Find all orders
   * @returns Promise<Order[]> - List of all orders
   */
  abstract findAll(): Promise<Order[]>;

  /**
   * Find order by ID
   * @param id - Order ID to find
   * @returns Promise<Order> - Found order
   */
  abstract findById(id: Order['id']): Promise<Order>;

  /**
   * Find orders by user ID
   * @param userId - User ID to find orders for
   * @returns Promise<Order[]> - List of orders for the user
   */
  abstract findByUserId(userId: string): Promise<Order[]>;
}
