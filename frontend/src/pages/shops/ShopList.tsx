import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { Shop, Mall } from '../../types';
import { DataTable, PageHeader, Modal, FormInput, FormSelect } from '../../components';

interface ShopFormData {
  shopName: string;
  shopCategory: 'WHOLESALE' | 'RETAIL';
  shopStatus: 'OPEN' | 'CLOSED';
  mall: Mall | undefined;
}

interface ShopFormErrors {
  shopName?: string;
  mall?: string;
}

export function ShopList() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [formData, setFormData] = useState<ShopFormData>({
    shopName: '',
    shopCategory: 'RETAIL',
    shopStatus: 'OPEN',
    mall: undefined,
  });
  const [formErrors, setFormErrors] = useState<ShopFormErrors>({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shopsData, mallsData] = await Promise.all([
        apiService.getAllShops(),
        apiService.getAllMalls(),
      ]);
      setShops(shopsData);
      setMalls(mallsData);
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
    setEditingShop(null);
    setFormData({ shopName: '', shopCategory: 'RETAIL', shopStatus: 'OPEN', mall: undefined });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      shopName: shop.shopName,
      shopCategory: shop.shopCategory,
      shopStatus: shop.shopStatus,
      mall: shop.mall,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (shop: Shop) => {
    if (!shop.shopId || !confirm(`Are you sure you want to delete ${shop.shopName}?`)) return;
    try {
      await apiService.deleteShop(shop.shopId);
      fetchData();
    } catch (err) {
      alert('Failed to delete shop');
    }
  };

  const validateForm = () => {
    const errors: ShopFormErrors = {};
    if (!formData.shopName?.trim()) errors.shopName = 'Shop name is required';
    if (!formData.mall) errors.mall = 'Mall is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const shopData = {
        shopName: formData.shopName!,
        shopCategory: formData.shopCategory!,
        shopStatus: formData.shopStatus!,
        mall: { id: formData.mall?.id } as Mall,
      };

      if (editingShop) {
        await apiService.updateShop(editingShop.shopId!, shopData);
      } else {
        await apiService.createShop(shopData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save shop');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'shopName' as keyof Shop },
    { header: 'Category', accessor: 'shopCategory' as keyof Shop },
    { header: 'Status', accessor: 'shopStatus' as keyof Shop },
    { header: 'Mall', accessor: (shop: Shop) => shop.mall?.mallName || 'N/A' },
  ];

  return (
    <div>
      <PageHeader
        title="Shops"
        description="Manage shops"
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Shop
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
          data={shops}
          columns={columns}
          keyAccessor={(shop) => shop.shopId!}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={(shop) => navigate(`/shops/${shop.shopId}`)}
          emptyMessage="No shops found. Click 'Add Shop' to create one."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShop ? 'Edit Shop' : 'Create Shop'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Shop Name"
            value={formData.shopName || ''}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            error={formErrors.shopName}
            placeholder="Enter shop name"
          />
          <FormSelect
            label="Category"
            value={formData.shopCategory || ''}
            onChange={(e) => setFormData({ ...formData, shopCategory: e.target.value as 'WHOLESALE' | 'RETAIL' })}
            options={[
              { value: 'WHOLESALE', label: 'Wholesale' },
              { value: 'RETAIL', label: 'Retail' },
            ]}
            placeholder="Select category"
          />
          <FormSelect
            label="Status"
            value={formData.shopStatus || ''}
            onChange={(e) => setFormData({ ...formData, shopStatus: e.target.value as 'OPEN' | 'CLOSED' })}
            options={[
              { value: 'OPEN', label: 'Open' },
              { value: 'CLOSED', label: 'Closed' },
            ]}
            placeholder="Select status"
          />
          <FormSelect
            label="Mall"
            value={formData.mall?.id?.toString() || ''}
            onChange={(e) => {
              const mallId = Number(e.target.value);
              const selectedMall = malls.find(m => m.id === mallId);
              setFormData({ ...formData, mall: selectedMall });
            }}
            options={malls.map(m => ({ value: m.id!.toString(), label: m.mallName }))}
            placeholder="Select mall"
            error={formErrors.mall ? 'Mall is required' : undefined}
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
              {editingShop ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}