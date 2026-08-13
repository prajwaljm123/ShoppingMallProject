import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { Item, Shop } from '../../types';
import { DataTable, PageHeader, Modal, FormInput, FormSelect } from '../../components';

interface ItemFormData {
  itemName: string;
  price: number;
  manufacturingDate: string;
  expiry: string;
  category: 'CLOTHING' | 'MOBILES' | 'ACCESSORIES';
  shop: Shop | undefined;
}

interface ItemFormErrors {
  itemName?: string;
  price?: string;
  manufacturingDate?: string;
  expiry?: string;
  shop?: string;
}

export function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [formData, setFormData] = useState<ItemFormData>({
    itemName: '',
    price: 0,
    manufacturingDate: new Date().toISOString().split('T')[0],
    expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'CLOTHING',
    shop: undefined,
  });
  const [formErrors, setFormErrors] = useState<ItemFormErrors>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialShopId = searchParams.get('shopId');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shopsData, itemsData] = await Promise.all([
        apiService.getAllShops(),
        selectedShopId 
          ? apiService.getItemsByShop(Number(selectedShopId))
          : apiService.getAllItems(),
      ]);
      setShops(shopsData);
      setItems(itemsData);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    try {
      setLoading(true);
      const data = await apiService.searchItems(searchQuery);
      setItems(data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      itemName: '',
      price: 0,
      manufacturingDate: new Date().toISOString().split('T')[0],
      expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: 'CLOTHING',
      shop: initialShopId ? shops.find(s => s.shopId === Number(initialShopId)) : undefined,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      price: item.price,
      manufacturingDate: item.manufacturingDate,
      expiry: item.expiry,
      category: item.category,
      shop: item.shop,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Item) => {
    if (!item.id || !confirm(`Are you sure you want to delete ${item.itemName}?`)) return;
    try {
      await apiService.deleteItem(item.id);
      fetchData();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const validateForm = () => {
    const errors: ItemFormErrors = {};
    if (!formData.itemName?.trim()) errors.itemName = 'Item name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.manufacturingDate) errors.manufacturingDate = 'Manufacturing date is required';
    if (!formData.expiry) errors.expiry = 'Expiry date is required';
    if (!formData.shop) errors.shop = 'Shop is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const itemData = {
        itemName: formData.itemName!,
        price: formData.price!,
        manufacturingDate: formData.manufacturingDate!,
        expiry: formData.expiry!,
        category: formData.category!,
        shop: { shopId: formData.shop?.shopId } as Shop,
      };

      if (editingItem) {
        await apiService.updateItem(editingItem.id!, itemData);
      } else {
        await apiService.createItem(itemData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save item');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'itemName' as keyof Item },
    { header: 'Category', accessor: 'category' as keyof Item },
    { header: 'Price', accessor: (item: Item) => `$${item.price?.toFixed(2)}` },
    { header: 'Mfg Date', accessor: 'manufacturingDate' as keyof Item },
    { header: 'Expiry', accessor: 'expiry' as keyof Item },
    { header: 'Shop', accessor: (item: Item) => item.shop?.shopName || 'N/A' },
  ];

  return (
    <div>
      <PageHeader
        title="Items"
        description="Manage inventory items"
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Item
          </button>
        }
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
        </form>
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
          data={items}
          columns={columns}
          keyAccessor={(item) => item.id!}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={(item) => navigate(`/items/${item.id}`)}
          emptyMessage="No items found."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Item' : 'Create Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Item Name"
              value={formData.itemName || ''}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              error={formErrors.itemName}
              placeholder="Enter item name"
            />
            <FormSelect
              label="Category"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'CLOTHING' | 'MOBILES' | 'ACCESSORIES' })}
              options={[
                { value: 'CLOTHING', label: 'Clothing' },
                { value: 'MOBILES', label: 'Mobiles' },
                { value: 'ACCESSORIES', label: 'Accessories' },
              ]}
              placeholder="Select category"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              error={formErrors.price}
              placeholder="Enter price"
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Manufacturing Date"
              type="date"
              value={formData.manufacturingDate || ''}
              onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
              error={formErrors.manufacturingDate}
            />
            <FormInput
              label="Expiry Date"
              type="date"
              value={formData.expiry || ''}
              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              error={formErrors.expiry}
            />
          </div>
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
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}