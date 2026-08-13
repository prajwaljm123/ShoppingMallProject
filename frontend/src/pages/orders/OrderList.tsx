import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { OrderDetails, Customer, Shop } from '../../types';
import { DataTable, PageHeader, Modal, FormInput, FormSelect } from '../../components';

interface OrderFormData {
  orderDate: string;
  totalAmount: number;
  paymentMode: 'CARD' | 'CASH' | 'UPI' | 'ONLINEBANKING';
  customer: Customer | undefined;
  shop: Shop | undefined;
}

interface OrderFormErrors {
  orderDate?: string;
  totalAmount?: string;
  customer?: string;
  shop?: string;
}

export function OrderList() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderDetails | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    paymentMode: 'CASH',
    customer: undefined,
    shop: undefined,
  });
  const [formErrors, setFormErrors] = useState<OrderFormErrors>({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, customersData, shopsData] = await Promise.all([
        apiService.getAllOrders(),
        apiService.getAllCustomers(),
        apiService.getAllShops(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setShops(shopsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setFormData({
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: 0,
      paymentMode: 'CASH',
      customer: undefined,
      shop: undefined,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (order: OrderDetails) => {
    setEditingOrder(order);
    setFormData({
      orderDate: order.orderDate,
      totalAmount: order.totalAmount,
      paymentMode: order.paymentMode,
      customer: order.customer,
      shop: order.shop,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (order: OrderDetails) => {
    if (!order.id || !confirm(`Are you sure you want to cancel order #${order.id}?`)) return;
    try {
      await apiService.cancelOrder(order.id);
      fetchData();
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const validateForm = () => {
    const errors: OrderFormErrors = {};
    if (!formData.orderDate) errors.orderDate = 'Order date is required';
    if (!formData.totalAmount || formData.totalAmount <= 0) errors.totalAmount = 'Valid amount is required';
    if (!formData.customer) errors.customer = 'Customer is required';
    if (!formData.shop) errors.shop = 'Shop is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const orderData = {
        orderDate: formData.orderDate!,
        totalAmount: formData.totalAmount!,
        paymentMode: formData.paymentMode!,
        customer: { id: formData.customer?.id } as Customer,
        shop: { shopId: formData.shop?.shopId } as Shop,
      };

      if (editingOrder) {
        await apiService.updateOrder(editingOrder.id!, orderData);
      } else {
        await apiService.createOrder(orderData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save order');
    }
  };

  const columns = [
    { header: 'Order ID', accessor: (order: OrderDetails) => `#${order.id}` },
    { header: 'Date', accessor: 'orderDate' as keyof OrderDetails },
    { header: 'Customer', accessor: (order: OrderDetails) => order.customer?.customerName || 'N/A' },
    { header: 'Shop', accessor: (order: OrderDetails) => order.shop?.shopName || 'N/A' },
    { header: 'Amount', accessor: (order: OrderDetails) => `$${order.totalAmount?.toFixed(2)}` },
    { header: 'Payment', accessor: 'paymentMode' as keyof OrderDetails },
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage orders"
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create Order
          </button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <DataTable
          data={orders}
          columns={columns}
          keyAccessor={(order) => order.id!}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={(order) => navigate(`/orders/${order.id}`)}
          emptyMessage="No orders found."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrder ? 'Edit Order' : 'Create Order'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Order Date"
              type="date"
              value={formData.orderDate || ''}
              onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              error={formErrors.orderDate}
            />
            <FormInput
              label="Total Amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.totalAmount?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              error={formErrors.totalAmount}
              placeholder="Enter amount"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Payment Mode"
              value={formData.paymentMode || ''}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as 'CARD' | 'CASH' | 'UPI' | 'ONLINEBANKING' })}
              options={[
                { value: 'CARD', label: 'Card' },
                { value: 'CASH', label: 'Cash' },
                { value: 'UPI', label: 'UPI' },
                { value: 'ONLINEBANKING', label: 'Online Banking' },
              ]}
              placeholder="Select payment mode"
            />
            <FormSelect
              label="Customer"
              value={formData.customer?.id?.toString() || ''}
              onChange={(e) => {
                const custId = Number(e.target.value);
                const selectedCustomer = customers.find(c => c.id === custId);
                setFormData({ ...formData, customer: selectedCustomer });
              }}
              options={customers.map(c => ({ value: c.id!.toString(), label: `${c.customerName} (${c.email})` }))}
              placeholder="Select customer"
              error={formErrors.customer ? 'Customer is required' : undefined}
            />
          </div>
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
              {editingOrder ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}