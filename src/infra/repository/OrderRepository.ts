import Order from "../../domain/Order";
import { inject } from "../di/Registry";

export default interface OrderRepository {
  saveOrder(order: Order): Promise<void>;
  getOrder(orderId: string): Promise<Order>;
}

export class OrderRepositoryDatabase implements OrderRepository {

  @inject('databaseConnection')
  databaseConnection!: any;

  async saveOrder(order: Order): Promise<void> {
    await this.databaseConnection.query(`
      INSERT INTO ccca.order (order_id, account_id, market_id, side, quantity, price, status, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      order.getOrderId(),
      order.getAccountId(),
      order.marketId,
      order.side,
      order.quantity,
      order.price,
      order.status,
      order.timestamp
    ]);
  }

  async getOrder(orderId: string): Promise<Order> {
    const [orderData] = await this.databaseConnection.query(`
      SELECT * FROM ccca.order WHERE order_id = $1
    `, [orderId]);
    if (!orderData) throw new Error('Order not found');
    return new Order(
      orderData.order_id, 
      orderData.account_id, 
      orderData.market_id, 
      orderData.side, 
      orderData.quantity,
      parseFloat(orderData.price),
      orderData.status,
      orderData.timestamp
    );
  }
}