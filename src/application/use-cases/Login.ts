import { SessionRepository } from '../ports/SessionRepository.ts';
import { User } from '../../domain/model/User.ts';

export class LoginUseCase {
  constructor(private readonly sessionRepo: SessionRepository) {}

  public async execute(username: string, password: string): Promise<User> {
    if (!username.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }
    if (!password) {
      throw new Error('La contraseña es requerida');
    }

    return this.sessionRepo.login(username.trim().toLowerCase(), password);
  }

  public getCurrentUser(): User | null {
    return this.sessionRepo.getSession();
  }

  public logout(): void {
    this.sessionRepo.clearSession();
  }
}
