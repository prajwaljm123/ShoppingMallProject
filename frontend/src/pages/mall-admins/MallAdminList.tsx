import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { MallAdmin, Mall } from '../../types';
import { DataTable, PageHeader, Modal, FormInput, FormSelect } from '../../components';

export function MallAdminList() {
  const [admins, setAdmins] = useState<MallAdmin[]>([]);
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<MallAdmin | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    phone: '',
    mall: undefined as Mall | undefined
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mallsData, adminsData] = await Promise.all([
        apiService.getAllMalls(),
        apiService.getAllMallAdmins()
      ]);
      setMalls(mallsData);
      setAdmins(adminsData);
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
    setEditingAdmin(null);
    setFormData({ name: '', password: '', phone: '', mall: undefined });
    setIsModalOpen(true);
  };

  const handleEdit = (admin: MallAdmin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      password: admin.password,
      phone: admin.phone,
      mall: admin.mall,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        mall: formData.mall ? { id: formData.mall.id } : null
      };

      if (editingAdmin) {
        await apiService.updateMallAdmin(editingAdmin.id!, payload as any);
      } else {
        await apiService.createMallAdmin(payload as any);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save mall admin');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof MallAdmin },
    { header: 'Phone', accessor: 'phone' as keyof MallAdmin },
    { header: 'Mall', accessor: (admin: MallAdmin) => admin.mall?.mallName || 'No Mall Assigned' },
  ];

  return (
    <div>
      <PageHeader
        title="Mall Admins"
        description="Manage mall administrators"
        action={
          <button onClick={handleOpenCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2">
            <PlusIcon className="w-5 h-5" /> Add Admin
          </button>
        }
      />
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <DataTable
          data={admins}
          columns={columns}
          keyAccessor={(admin) => admin.id!}
          onEdit={handleEdit}
          emptyMessage="No mall admins found."
        />
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAdmin ? 'Edit Admin' : 'Create Admin'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <FormInput label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <FormInput label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <FormSelect
            label="Mall"
            value={formData.mall?.id?.toString() || ''}
            onChange={(e) => {
              const mallId = Number(e.target.value);
              setFormData({ ...formData, mall: malls.find(m => m.id === mallId) });
            }}
            options={malls.map(m => ({ value: m.id!.toString(), label: m.mallName }))}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
