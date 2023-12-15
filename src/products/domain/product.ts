export class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
    readonly quantity: number,
    readonly registedAt: Date,
  ) {}
}
