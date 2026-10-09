export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  expiresAt: string;
  userId: string;
  username: string;
  role: 'admin' | 'seller';
}

export interface CategoryDto {
  id: string;
  name: string;
}

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  imageKey: string | null;
}

export interface ProductListResponseDto {
  items: ProductDto[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  imageKey?: string | null;
}

export interface UpdateProductDto {
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  imageKey?: string | null;
}

export interface PlaceSaleItemRequestDto {
  productId: string;
  quantity: number;
}

export interface PlaceSaleRequestDto {
  items: PlaceSaleItemRequestDto[];
}

export interface SaleItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleResponseDto {
  id: string;
  soldAt: string;
  soldByUserId: string;
  soldBy: string;
  items: SaleItemResponseDto[];
  total: number;
}

export interface SaleListResponseDto {
  items: SaleResponseDto[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SalesReportRowDto {
  productId: string;
  productName: string;
  categoryName: string;
  unitsSold: number;
  revenue: number;
}

export interface SalesReportResponseDto {
  startDate: string;
  endDate: string;
  totalSalesCount: number;
  grandTotal: number;
  items: SalesReportRowDto[];
}

export interface ProblemDetailsDto {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}

export interface ValidationErrorDto {
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}
