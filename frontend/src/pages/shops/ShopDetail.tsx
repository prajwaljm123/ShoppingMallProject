import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { Shop, Item, Employee, Customer } from '../../types';
import { PageHeader, DataTable } from '../../components';

export function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'employees' | 'customers'>('items');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [shopData, itemsData, employeesData, customersData] = await Promise.all([
          apiService.getShopById(Number(id)),
          apiService.getItemsByShop(Number(id)),
          apiService.getAllEmployees(), // Would need shop-specific endpoint
          apiService.getAllCustomers(), // Would need shop-specific endpoint
        ]);
        setShop(shopData);
        setItems(itemsData);
        setEmployees(employeesData.filter(e => e.shop?.shopId === Number(id)));
        setCustomers(customersData.filter(c => c.shop?.shopId === Number(id)));
        setError(null);
      } catch (err) {
        setError('Failed to fetch shop details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const itemColumns = [
    { header: 'Name', accessor: 'itemName' as keyof Item },
    { header: 'Category', accessor: 'category' as keyof Item },
    { header: 'Price', accessor: (item: Item) => `$${item.price?.toFixed(2)}` },
    { header: 'Expiry', accessor: 'expiry' as keyof Item },
  ];

  const employeeColumns = [
    { header: 'Name', accessor: 'employeeName' as keyof Employee },
    { header: 'Role', accessor: 'role' as keyof Employee },
    { header: 'Email', accessor: 'email' as keyof Employee },
    { header: 'Salary', accessor: (emp: Employee) => `$${emp.salary?.toFixed(2)}` },
  ];

  const customerColumns = [
    { header: 'Name', accessor: 'customerName' as keyof Customer },
    { header: 'Email', accessor: 'email' as keyof Customer },
    { header: 'Phone', accessor: 'phone' as keyof Customer },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error || !shop) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Shop not found'}</p>
        <Link to="/shops" className="mt-4 text-indigo-600 hover:underline">
          Back to Shops
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/shops"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Shops
        </Link>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{shop.shopName}</h1>
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {shop.shopCategory}
                </span>
                <span className={`px-2 py-1 rounded ${
                  shop.shopStatus === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {shop.shopStatus}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Mall</p>
              <p className="font-medium">{shop.mall?.mallName || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8" aria-label="Tabs">
          {[
            { id: 'items', label: `Items (${items.length})` },
            { id: 'employees', label: `Employees (${employees.length})` },
            { id: 'customers', label: `Customers (${customers.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'items' && (
        <PageHeader
          title="Items"
          action={
            <Link to={`/items/create?shopId=${shop.shopId}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Add Item
            </Link>
          }
        />
      )}
      {activeTab === 'employees' && (
        <PageHeader
          title="Employees"
          action={
            <Link to={`/employees/create?shopId=${shop.shopId}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Add Employee
            </Link>
          }
        />
      )}
      {activeTab === 'customers' && (
        <PageHeader
          title="Customers"
          action={
            <Link to={`/customers/create?shopId=${shop.shopId}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Add Customer
            </Link>
          }
        />
      )}

      {activeTab === 'items' && (
        <DataTable
          data={items}
          columns={itemColumns}
          keyAccessor={(item) => item.id!}
          onView={(item) => window.location.href = `/items/${item.id}`}
          emptyMessage="No items in this shop yet."
        />
      )}
      {activeTab === 'employees' && (
        <DataTable
          data={employees}
          columns={employeeColumns}
          keyAccessor={(emp) => emp.id!}
          emptyMessage="No employees in this shop yet."
        />
      )}
      {activeTab === 'customers' && (
        <DataTable
          data={customers}
          columns={customerColumns}
          keyAccessor={(cust) => cust.id!}
          emptyMessage="No customers in this shop yet."
        />
      )}
    </div>
  );
}