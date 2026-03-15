import UUID from "./UUID";

export default class Order {

  private orderId: UUID
  private accountId: UUID

  constructor(
    orderId: string, 
    accountId: string,
    readonly marketId: string, 
    readonly side: string, 
    readonly quantity: number, 
    readonly price: number,
    readonly status: string,
    readonly timestamp: Date
  ) {
    this.orderId = new UUID(orderId);
    this.accountId = new UUID(accountId);
  }

  static create(accountId: string, marketId: string, side: string, quantity: number, price: number): Order {
    const orderId = UUID.create();
    const timestamp = new Date();
    const status = "open";
    return new Order(orderId.getValue(), accountId, marketId, side, quantity, price, status, timestamp);
  }

  getMainAssetId(): string {
     const [mainAssetId, paymentAssetId] = this.marketId.split("-");
     return mainAssetId;
  }

  getPaymentAssetId(): string {
    const [mainAssetId, paymentAssetId] = this.marketId.split("-");
    return paymentAssetId;
  }

  getOrderId(): string {
    return this.orderId.getValue();
  }

  getAccountId(): string {
    return this.accountId.getValue();
  }
}