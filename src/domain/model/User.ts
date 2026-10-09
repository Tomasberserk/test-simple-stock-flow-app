export type UserRole = 'admin' | 'seller';

export interface UserSession {
  readonly id: string;
  readonly username: string;
  readonly role: UserRole;
  readonly token: string;
  readonly expiresAt: string;
}

export class User {
  readonly id: string;
  readonly username: string;
  readonly role: UserRole;
  readonly token: string;
  readonly expiresAt: string;

  constructor(session: UserSession) {
    this.id = session.id;
    this.username = session.username;
    this.role = session.role;
    this.token = session.token;
    this.expiresAt = session.expiresAt;
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public isSeller(): boolean {
    return this.role === 'seller';
  }

  public isExpired(): boolean {
    return new Date(this.expiresAt).getTime() <= Date.now();
  }
}
