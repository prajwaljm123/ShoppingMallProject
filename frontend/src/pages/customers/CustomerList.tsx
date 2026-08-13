import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { Customer, Shop } from '../../types';
import { DataTable, PageHeader, Modal, FormInput, FormSelect } from '../../components';

interface CustomerFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  shop: Shop | undefined;
}

interface CustomerFormErrors {
  customerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  shop?: string;
}

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [formData, setFormData] = useState<CustomerFormData>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    shop: undefined,
  });
  const [formErrors, setFormErrors] = useState<CustomerFormErrors>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialShopId = searchParams.get('shopId');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shopsData, customersData] = await Promise.all([
        apiService.getAllShops(),
        selectedShopId 
          ? apiService.getAllCustomers().then(c => c.filter(cust => cust.shop?.shopId === Number(selectedShopId)))
          : apiService.getAllCustomers(),
      ]);
      setShops(shopsData);
      setCustomers(customersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialShopId) {
      setSelectedShopId(initialShopId);
    }
    fetchData();
  }, [initialShopId, selectedShopId]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setFormData({
      customerName: '',
      email: '',
      phone: '',
      address: '',
      shop: initialShopId ? shops.find(s => s.shopId === Number(initialShopId)) : undefined,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerName: customer.customerName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      shop: customer.shop,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (!customer.id || !confirm(`Are you sure you want to delete ${customer.customerName}?`)) return;
    try {
      await apiService.deleteCustomer(customer.id);
      fetchData();
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  const validateForm = () => {
    const errors: CustomerFormErrors = {};
    if (!formData.customerName?.trim()) errors.customerName = 'Customer name is required';
    if (!formData.email?.trim()) errors.email = 'Email is required';
    if (!formData.phone?.trim()) errors.phone = 'Phone is required';
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.shop) errors.shop = 'Shop is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const customerData = {
        customerName: formData.customerName!,
        email: formData.email!,
        phone: formData.phone!,
        address: formData.address!,
        shop: { shopId: formData.shop?.shopId } as Shop,
      };

      if (editingCustomer) {
        await apiService.updateCustomer(editingCustomer.id!, customerData);
      } else {
        await apiService.createCustomer(customerData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save customer');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'customerName' as keyof Customer },
    { header: 'Email', accessor: 'email' as keyof Customer },
    { header: 'Phone', accessor: 'phone' as keyof Customer },
    { header: 'Address', accessor: 'address' as keyof Customer },
    { header: 'Shop', accessor: (cust: Customer) => cust.shop?.shopName || 'N/A' },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage customers"
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Customer
          </button>
        }
      />

      <div className="mb-6">
        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Shops</option>
          {shops.map(shop => (
            <option key={shop.shopId} value={shop.shopId!.toString()}>
              {shop.shopName}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <DataTable
          data={customers}
          columns={columns}
          keyAccessor={(cust) => cust.id!}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={(cust) => navigate(`/customers/${cust.id}`)}
          emptyMessage="No customers found."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Customer Name"
            value={formData.customerName || ''}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            error={formErrors.customerName}
            placeholder="Enter customer name"
          />
          <FormInput
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            placeholder="Enter email"
          />
          <FormInput
            label="Phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={formErrors.phone}
            placeholder="Enter phone"
          />
          <FormInput
            label="Address"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={formErrors.address}
            placeholder="Enter address"
          />
          <FormSelect
            label="Shop"
            value={formData.shop?.shopId?.toString() || ''}
            onChange={(e) => {
              const shopId = Number(e.target.value);
              const selectedShop = shops.find(s => s.shopId === shopId);
              setFormData({ ...formData, shop: selectedShop });
            }}
            options={shops.map(s => ({ value: s.shopId!.toString(), label: s.shopName }))}
            placeholder="Select shop"
            error={formErrors.shop ? 'Shop is required' : undefined}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {editingCustomer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}