# Simple Stock Flow — Frontend (React + TypeScript + Vite + Tailwind CSS)

Interfaz web del sistema **Simple Stock Flow** implementada en React 18, TypeScript, Vite y Tailwind CSS, siguiendo rigurosamente una **Arquitectura Onion (Cebolla)** de 4 capas concéntricas idéntica al backend.

---

## 🏛️ Estructura Arquitectónica

```text
src/
├── domain/                                          # ANILLO 1: Modelos e invariantes en TypeScript puro (Sin React)
│   └── model/                                       # Product, Cart, Sale, SaleItem, Money, User, Report
│
├── application/                                     # ANILLO 2: Casos de uso y Puertos
│   ├── ports/                                       # ProductRepository, CartRepository, SessionRepository, SaleRepository, ReportRepository
│   └── use-cases/                                   # BrowseCatalog, AddToCart, Checkout, Login, ViewSalesReport, ManageCatalog
│
├── infrastructure/                                  # ANILLO 3: Adaptadores HTTP, Persistencia local y Mappers
│   ├── http/                                        # HttpClient resiliente con interceptor JWT y RFC 7807 ProblemDetails
│   ├── mappers/                                     # ProductMapper, SaleMapper, ReportMapper (DTO -> Dominio)
│   ├── repositories/                                # HttpProductRepository, LocalCartRepository, HttpSessionRepository, etc.
│   └── providers.ts                                 # Composition root del Frontend
│
└── features/                                        # ANILLO 4: Presentación e Interfaz de Usuario (React)
    ├── auth/                                        # Formulario de inicio de sesión con validación
    ├── catalog/                                     # Catálogo con búsqueda, filtros, control de existencias y modales de admin
    ├── cart/                                        # Carrito de compras desplegable con validación local de stock y checkout atómico
    ├── sales/                                       # Historial de ventas inmutables (RN-07) con desglose de ítems congelados
    ├── reports/                                     # Reporte consolidado de ventas con KPIs e ingresos por producto
    └── layout/                                      # Barra de navegación con roles ('admin' / 'seller') y contador dinámico de carrito
```

---

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (con proxy a :8000 para /api y /media)
npm run dev

# Compilar para producción (TypeScript + Vite)
npm run build

# Ejecutar pruebas unitarias de Dominio y Casos de Uso
npm test
```

---

## 🧪 Pruebas Automatizadas

El núcleo de negocio del frontend (`Cart`, `Money`, `Product`, `AddToCartUseCase`, `CheckoutUseCase`) se valida de manera autónoma con pruebas unitarias ejecutadas directamente sobre Node.js:

```bash
npm test
```

Estas pruebas verifican la pureza arquitectónica demostrando que las reglas de negocio del cliente se ejecutan **sin navegador, sin red y sin servidor** mediante dobles de prueba en memoria.
