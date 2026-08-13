import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { ShopOwner } from '../../types';
import { DataTable, PageHeader, Modal, FormInput } from '../../components';

export function ShopOwnerList() {
  const [owners, setOwners] = useState<ShopOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<ShopOwner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    dob: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllShopOwners();
      setOwners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingOwner(null);
    setFormData({ name: '', address: '', dob: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (owner: ShopOwner) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      address: owner.address,
      dob: owner.dob,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOwner) {
        await apiService.updateShopOwner(editingOwner.id!, formData as any);
      } else {
        await apiService.createShopOwner(formData as any);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save shop owner');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof ShopOwner },
    { header: 'Address', accessor: 'address' as keyof ShopOwner },
    { header: 'DOB', accessor: 'dob' as keyof ShopOwner },
    { header: 'Shop', accessor: (owner: ShopOwner) => owner.shop?.shopName || 'No Shop Assigned' },
  ];

  return (
    <div>
      <PageHeader
        title="Shop Owners"
        description="Manage shop owners"
        action={
          <button onClick={handleOpenCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2">
            <PlusIcon className="w-5 h-5" /> Add Owner
          </button>
        }
      />
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <DataTable
          data={owners}
          columns={columns}
          keyAccessor={(owner) => owner.id!}
          onEdit={handleEdit}
          emptyMessage="No shop owners found."
        />
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingOwner ? 'Edit Owner' : 'Create Owner'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <FormInput label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <FormInput label="DOB" type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
