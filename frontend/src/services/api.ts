import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { 
  Mall, Shop, Item, Customer, Employee, 
  ShopOwner, MallAdmin, OrderDetails, User 
} from '../types';

const API_BASE_URL = 'http://localhost:8082/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Mall APIs
  async getAllMalls(): Promise<Mall[]> {
    const response = await this.api.get<Mall[]>('/malls');
    return response.data;
  }

  async getMallById(id: number): Promise<Mall> {
    const response = await this.api.get<Mall>(`/malls/${id}`);
    return response.data;
  }

  async createMall(mall: Mall): Promise<Mall> {
    const response = await this.api.post<Mall>('/malls', mall);
    return response.data;
  }

  async updateMall(id: number, mall: Mall): Promise<Mall> {
    const response = await this.api.put<Mall>(`/malls/${id}`, mall);
    return response.data;
  }

  async deleteMall(id: number): Promise<void> {
    await this.api.delete(`/malls/${id}`);
  }

  // Shop APIs
  async getAllShops(): Promise<Shop[]> {
    const response = await this.api.get<Shop[]>('/shops');
    return response.data;
  }

  async getShopById(id: number): Promise<Shop> {
    const response = await this.api.get<Shop>(`/shops/${id}`);
    return response.data;
  }

  async getShopsByMall(mallId: number): Promise<Shop[]> {
    const response = await this.api.get<Shop[]>(`/shops/mall/${mallId}`);
    return response.data;
  }

  async createShop(shop: Shop): Promise<Shop> {
    const response = await this.api.post<Shop>('/shops', shop);
    return response.data;
  }

  async updateShop(id: number, shop: Shop): Promise<Shop> {
    const response = await this.api.put<Shop>(`/shops/${id}`, shop);
    return response.data;
  }

  async deleteShop(id: number): Promise<void> {
    await this.api.delete(`/shops/${id}`);
  }

  // Item APIs
  async getAllItems(): Promise<Item[]> {
    const response = await this.api.get<Item[]>('/items');
    return response.data;
  }

  async getItemById(id: number): Promise<Item> {
    const response = await this.api.get<Item>(`/items/${id}`);
    return response.data;
  }

  async getItemsByShop(shopId: number): Promise<Item[]> {
    const response = await this.api.get<Item[]>(`/items/shop/${shopId}`);
    return response.data;
  }

  async searchItems(name: string): Promise<Item[]> {
    const response = await this.api.get<Item[]>('/items/search', {
      params: { name },
    });
    return response.data;
  }

  async createItem(item: Item): Promise<Item> {
    const response = await this.api.post<Item>('/items', item);
    return response.data;
  }

  async updateItem(id: number, item: Item): Promise<Item> {
    const response = await this.api.put<Item>(`/items/${id}`, item);
    return response.data;
  }

  async deleteItem(id: number): Promise<void> {
    await this.api.delete(`/items/${id}`);
  }

  // Customer APIs
  async getAllCustomers(): Promise<Customer[]> {
    const response = await this.api.get<Customer[]>('/customers');
    return response.data;
  }

  async getCustomerById(id: number): Promise<Customer> {
    const response = await this.api.get<Customer>(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    const response = await this.api.post<Customer>('/customers', customer);
    return response.data;
  }

  async updateCustomer(id: number, customer: Customer): Promise<Customer> {
    const response = await this.api.put<Customer>(`/customers/${id}`, customer);
    return response.data;
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.api.delete(`/customers/${id}`);
  }

  // Employee APIs
  async getAllEmployees(): Promise<Employee[]> {
    const response = await this.api.get<Employee[]>('/employees');
    return response.data;
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const response = await this.api.get<Employee>(`/employees/${id}`);
    return response.data;
  }

  async createEmployee(employee: Employee): Promise<Employee> {
    const response = await this.api.post<Employee>('/employees', employee);
    return response.data;
  }

  async updateEmployee(id: number, employee: Employee): Promise<Employee> {
    const response = await this.api.put<Employee>(`/employees/${id}`, employee);
    return response.data;
  }

  // Shop Owner APIs
  async getAllShopOwners(): Promise<ShopOwner[]> {
    const response = await this.api.get<ShopOwner[]>('/shop-owners');
    return response.data;
  }

  async getShopOwnerById(id: number): Promise<ShopOwner> {
    const response = await this.api.get<ShopOwner>(`/shop-owners/${id}`);
    return response.data;
  }

  async createShopOwner(shopOwner: ShopOwner): Promise<ShopOwner> {
    const response = await this.api.post<ShopOwner>('/shop-owners', shopOwner);
    return response.data;
  }

  async updateShopOwner(id: number, shopOwner: ShopOwner): Promise<ShopOwner> {
    const response = await this.api.put<ShopOwner>(`/shop-owners/${id}`, shopOwner);
    return response.data;
  }

  // Mall Admin APIs
  async getAllMallAdmins(): Promise<MallAdmin[]> {
    const response = await this.api.get<MallAdmin[]>('/mall-admins');
    return response.data;
  }

  async getMallAdminById(id: number): Promise<MallAdmin> {
    const response = await this.api.get<MallAdmin>(`/mall-admins/${id}`);
    return response.data;
  }

  async createMallAdmin(mallAdmin: MallAdmin): Promise<MallAdmin> {
    const response = await this.api.post<MallAdmin>('/mall-admins', mallAdmin);
    return response.data;
  }

  async updateMallAdmin(id: number, mallAdmin: MallAdmin): Promise<MallAdmin> {
    const response = await this.api.put<MallAdmin>(`/mall-admins/${id}`, mallAdmin);
    return response.data;
  }

  async loginMallAdmin(username: string, password: string): Promise<MallAdmin> {
    const response = await this.api.post<MallAdmin>('/mall-admins/login', { username, password });
    return response.data;
  }

  // Order APIs
  async getAllOrders(): Promise<OrderDetails[]> {
    const response = await this.api.get<OrderDetails[]>('/orders');
    return response.data;
  }

  async getOrderById(id: number): Promise<OrderDetails> {
    const response = await this.api.get<OrderDetails>(`/orders/${id}`);
    return response.data;
  }

  async getOrdersByCustomer(customerId: number): Promise<OrderDetails[]> {
    const response = await this.api.get<OrderDetails[]>(`/orders/customer/${customerId}`);
    return response.data;
  }

  async getOrdersByShop(shopId: number): Promise<OrderDetails[]> {
    const response = await this.api.get<OrderDetails[]>(`/orders/shop/${shopId}`);
    return response.data;
  }

  async createOrder(order: OrderDetails): Promise<OrderDetails> {
    const response = await this.api.post<OrderDetails>('/orders', order);
    return response.data;
  }

  async updateOrder(id: number, order: OrderDetails): Promise<OrderDetails> {
    const response = await this.api.put<OrderDetails>(`/orders/${id}`, order);
    return response.data;
  }

  async cancelOrder(id: number): Promise<void> {
    await this.api.delete(`/orders/${id}`);
  }

  // User APIs
  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get<User[]>('/users');
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return response.data;
  }

  async createUser(user: User): Promise<User> {
    const response = await this.api.post<User>('/users', user);
    return response.data;
  }

  async updateUser(id: number, user: User): Promise<User> {
    const response = await this.api.put<User>(`/users/${id}`, user);
    return response.data;
  }

  async loginUser(username: string, password: string): Promise<User> {
    const response = await this.api.post<User>('/users/login', { username, password });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;