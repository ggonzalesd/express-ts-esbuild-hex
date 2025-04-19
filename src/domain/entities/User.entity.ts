export class User {
  constructor(
    private id: number,
    private name: string,
    private email: string,
    private password: string,
    private createdAt: Date,
    private credits: number,
  ) {}

  public getId(): number {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getCredits(): number {
    return this.credits;
  }

  public setId(id: number): void {
    this.id = id;
  }
  public setName(name: string): void {
    this.name = name;
  }
  public setEmail(email: string): void {
    this.email = email;
  }
  public setPassword(password: string): void {
    this.password = password;
  }
  public setCredits(credits: number): void {
    this.credits = credits;
  }
}
