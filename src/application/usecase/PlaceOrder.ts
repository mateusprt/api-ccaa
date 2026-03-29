import Order from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";
import WalletRepository from "../../infra/repository/WalletRepository";

export default class PlaceOrder {

  @inject('orderRepository')
  orderRepository!: OrderRepository;

  @inject('walletRepository')
  walletRepository!: WalletRepository;

  async execute(input: Input): Promise<Output> {
    const wallet = await this.walletRepository.getWallet(input.accountId);
    wallet.processOrder(Order.create(input.accountId, input.marketId, input.side, input.quantity, input.price));
    const order = Order.create(input.accountId, input.marketId, input.side, input.quantity, input.price);
    await this.orderRepository.saveOrder(order);
    await this.walletRepository.upsertWallet(wallet);

    return {
      orderId: order.getOrderId()
    };
  }
}

type Input = {
  accountId: string;
  marketId: string;
  side: string;
  quantity: number;
  price: number;
}

type Output = {
  orderId: string;
}
