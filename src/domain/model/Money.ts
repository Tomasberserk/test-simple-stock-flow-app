export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number | string, currency: string = 'COP') {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) {
      throw new Error('Importe monetario inválido');
    }
    // Redondeo exacto a 2 decimales
    this.amount = Math.round((num + Number.EPSILON) * 100) / 100;
    this.currency = currency;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public formatted(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
    }).format(this.amount);
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('No se pueden sumar importes en monedas distintas');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  public multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  public isPositive(): boolean {
    return this.amount > 0;
  }
}
