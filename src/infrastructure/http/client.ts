export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setToken(token: string | null): void {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = new Headers(options.headers || {});
    const token = this.getToken();

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch {
      throw new ApiError(0, 'No se pudo conectar con el servidor. Verifique su conexión.');
    }

    // Manejo de códigos sin cuerpo (401, 403, 404, 204) según Bloque 6
    if (response.status === 204) {
      return null as T;
    }

    if (response.status === 401) {
      this.setToken(null);
      throw new ApiError(401, 'No autorizado. Se requiere iniciar sesión.');
    }

    if (response.status === 403) {
      throw new ApiError(403, 'Acceso denegado. Permisos insuficientes.');
    }

    if (response.status === 404) {
      throw new ApiError(404, 'El recurso solicitado no fue encontrado.');
    }

    // Parsear cuerpo de respuesta
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('json');

    if (!response.ok) {
      let errorMessage = 'Ocurrió un error inesperado';
      let details: unknown = null;

      if (isJson) {
        try {
          const errorData = await response.json();
          details = errorData;
          errorMessage = errorData.detail || errorData.error || errorData.title || errorMessage;
        } catch {
          // ignore
        }
      }

      throw new ApiError(response.status, errorMessage, details);
    }

    if (!isJson) {
      return (await response.text()) as unknown as T;
    }

    return (await response.json()) as T;
  }

  public get<T>(endpoint: string, query?: Record<string, string | number | undefined | null>): Promise<T> {
    let url = endpoint;
    if (query) {
      const searchParams = new URLSearchParams();
      for (const [key, val] of Object.entries(query)) {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  public put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient('/api');
