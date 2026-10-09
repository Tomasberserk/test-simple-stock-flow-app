import { SessionRepository } from '../../application/ports/SessionRepository.ts';
import { User, UserSession } from '../../domain/model/User.ts';
import { HttpClient } from '../http/client.ts';
import { LoginRequestDto, LoginResponseDto } from '../http/dto/api.dto.ts';

const USER_STORAGE_KEY = 'simple_stock_flow_user';

export class HttpSessionRepository implements SessionRepository {
  constructor(private readonly client: HttpClient) {}

  public getSession(): User | null {
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data) as UserSession;
      const user = new User(parsed);
      if (user.isExpired()) {
        this.clearSession();
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }

  public saveSession(user: User): void {
    const session: UserSession = {
      id: user.id,
      username: user.username,
      role: user.role,
      token: user.token,
      expiresAt: user.expiresAt,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session));
    this.client.setToken(user.token);
  }

  public clearSession(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.client.setToken(null);
  }

  public async login(username: string, password: string): Promise<User> {
    const payload: LoginRequestDto = { username, password };
    const res = await this.client.post<LoginResponseDto>('/auth/login', payload);

    const user = new User({
      id: res.userId,
      username: res.username,
      role: res.role,
      token: res.token,
      expiresAt: res.expiresAt,
    });

    this.saveSession(user);
    return user;
  }
}
