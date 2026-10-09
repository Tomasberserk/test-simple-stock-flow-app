import { User } from '../../domain/model/User.ts';

export interface SessionRepository {
  getSession(): User | null;
  saveSession(user: User): void;
  clearSession(): void;
  login(username: string, password: string): Promise<User>;
}
