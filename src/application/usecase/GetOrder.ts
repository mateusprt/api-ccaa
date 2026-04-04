import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetOrder {

  @inject('orderRepository')
  orderRepository!: OrderRepository;

  async execute(orderId: string): Promise<Output> {
    const order = await this.orderRepository.getOrder(orderId);
    return {
      orderId: order.getOrderId(),
      accountId: order.getAccountId(),
      marketId: order.marketId,
      side: order.side,
      quantity: Number(order.quantity),
      price: order.price,
      timestamp: order.timestamp,
      status: order.getStatus(),
      fillQuantity: order.getFillQuantity(),
      fillPrice: order.getFillPrice()
    };
  }
}

type Output = {
  orderId: string;
  accountId: string;
  marketId: string;
  side: string;
  quantity: number;
  price: number;
  timestamp: Date;
  status: string;
  fillQuantity: number;
  fillPrice: number;
}
