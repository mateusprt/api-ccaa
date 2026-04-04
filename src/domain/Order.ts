import UUID from "./UUID";

export default class Order {

  private orderId: UUID
  private accountId: UUID
  private fillQuantity: number;
  private fillPrice: number;

  constructor(
    orderId: string, 
    accountId: string,
    readonly marketId: string, 
    readonly side: string, 
    readonly quantity: number, 
    readonly price: number,
    private status: string,
    readonly timestamp: Date,
    fillQuantity: number,
    fillPrice: number
  ) {
    this.orderId = new UUID(orderId);
    this.accountId = new UUID(accountId);
    this.fillQuantity = fillQuantity;
    this.fillPrice = fillPrice;
  }

  static create(accountId: string, marketId: string, side: string, quantity: number, price: number): Order {
    const orderId = UUID.create();
    const timestamp = new Date();
    const status = "open";
    return new Order(orderId.getValue(), accountId, marketId, side, quantity, price, status, timestamp, 0, 0);
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

  fill(fillQuantity: number, fillPrice: number): void {
    if (this.getAvailableQuantity() < fillQuantity) throw new Error("Insufficient quantity");
    this.fillQuantity += fillQuantity;
    this.fillPrice = fillPrice;
    if (this.getAvailableQuantity() === 0) this.status = "closed";
  }

  getFillQuantity(): number {
    return this.fillQuantity;
  }

  getFillPrice(): number {
    return this.fillPrice;
  }

  getAvailableQuantity(): number {
    return this.quantity - this.fillQuantity;
  }

  getStatus(): string {
    return this.status;
  }
}