export interface Mall {
  id?: number;
  mallName: string;
  location: string;
  category: 'REGIONAL' | 'SUPERREGIONAL';
  mallAdmin?: MallAdmin;
  shops?: Shop[];
}

export interface MallAdmin {
  id?: number;
  name: string;
  password: string;
  phone: string;
  mall?: Mall;
}

export interface Shop {
  shopId?: number;
  shopName: string;
  shopCategory: 'WHOLESALE' | 'RETAIL';
  shopStatus: 'OPEN' | 'CLOSED';
  mall?: Mall;
  shopOwner?: ShopOwner;
  shopEmployees?: Employee[];
  customers?: Customer[];
}

export interface ShopOwner {
  id?: number;
  name: string;
  dob: string;
  address: string;
  shop?: Shop;
}

export interface Item {
  id?: number;
  itemName: string;
  price: number;
  manufacturingDate: string;
  expiry: string;
  category: 'CLOTHING' | 'MOBILES' | 'ACCESSORIES';
  shop?: Shop;
}

export interface Customer {
  id?: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  shop?: Shop;
}

export interface Employee {
  id?: number;
  name: string;
  dob: string;
  salary: number;
  address: string;
  designation: string;
  shop?: Shop;
}

export interface OrderItem {
  id?: number;
  quantity: number;
  price: number;
  item?: Item;
  orderDetails?: OrderDetails;
}

export interface OrderDetails {
  id?: number;
  orderDate: string;
  totalAmount: number;
  paymentMode: 'CARD' | 'CASH' | 'UPI' | 'ONLINEBANKING';
  customer?: Customer;
  orderItems?: OrderItem[];
  shop?: Shop;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  role: 'CUSTOMER' | 'SHOP_OWNER' | 'MALL_ADMIN' | 'EMPLOYEE';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}