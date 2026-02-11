
export enum ProductCategory {
  MOTORCYCLE = 'Pikipiki',
  SPARE_PART = 'Vipuri',
  ACCESSORY = 'Vifaa vya Ziada'
}

export enum UserRole {
  ADMIN = 'Msimamizi',
  STAFF = 'Mfanyakazi'
}

export enum PaymentMethod {
  CASH = 'Pesa Taslimu',
  CARD = 'Kadi',
  MOBILE = 'Malipo ya Simu'
}

export enum SaleStatus {
  PAID = 'Imelipwa'
}

export interface AppSettings {
  shopName: string;
  currency: string;
  taxRate: number;
  lowStockAlertLevel: number;
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'slate';
  enableAiInsights: boolean;
  uiDensity: 'compact' | 'relaxed';
  cornerRadius: 'none' | 'md' | 'full';
  sidebarMode: 'expanded' | 'collapsed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  supplierId: string;
  description: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
  lastPurchaseDate?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discountTotal: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  date: string;
  paidAt?: string;
  userId: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  change: number;
  reason: string;
  date: string;
  userId: string;
}
