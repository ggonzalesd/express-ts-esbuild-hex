export class User {
  constructor(
    private id: string,
    private display: string,
    private username: string,
    private email: string,
    private password: string,
    private verified: boolean,
    private role: string,
    private state: string,
    private createdAt: Date,
  ) {}

  getId(): string {
    return this.id;
  }
  getDisplay(): string {
    return this.display;
  }
  getUsername(): string {
    return this.username;
  }
  getEmail(): string {
    return this.email;
  }
  getPassword(): string {
    return this.password;
  }
  getVerified(): boolean {
    return this.verified;
  }
  getRole(): string {
    return this.role;
  }
  getState(): string {
    return this.state;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }

  setDisplay(display: string): void {
    this.display = display;
  }
  setUsername(username: string): void {
    this.username = username;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  setPassword(password: string): void {
    this.password = password;
  }
  setVerified(verified: boolean): void {
    this.verified = verified;
  }
  setRole(role: string): void {
    this.role = role;
  }
  setState(state: string): void {
    this.state = state;
  }
}
