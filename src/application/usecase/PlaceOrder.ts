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
    //
    const orders = await this.orderRepository.getOrdersByMarketIdAndStatus(input.marketId, "open");
    const highestBuy = orders.filter((order: Order) => order.side === "buy").sort((a: Order, b: Order) => b.price - a.price)[0];
    const lowestSell = orders.filter((order: Order) => order.side === "sell").sort((a: Order, b: Order) => a.price - b.price)[0];

    if (highestBuy && lowestSell && highestBuy.price >= lowestSell.price) {
      const fillQuantity = Math.min(highestBuy.quantity, lowestSell.quantity);
      // o que vale é o preço que já estava no livro de ofertas
      const fillPrice = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
      highestBuy.fill(fillQuantity, fillPrice);
      lowestSell.fill(fillQuantity, fillPrice);
      this.orderRepository.updateOrder(highestBuy);
      this.orderRepository.updateOrder(lowestSell);
    }
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
