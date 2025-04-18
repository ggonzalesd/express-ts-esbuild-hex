export class Product {
  constructor(
    private id: string,
    private name: string,
    private price: number,
  ) {}

  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getPrice(): number {
    return this.price;
  }

  public setId(id: string): void {
    this.id = id;
  }
  public setName(name: string): void {
    this.name = name;
  }
  public setPrice(price: number): void {
    this.price = price;
  }
}
