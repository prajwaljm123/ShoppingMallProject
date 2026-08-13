import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { Mall } from '../../types';
import { DataTable, PageHeader, Modal, FormInput, FormSelect } from '../../components';

export function MallList() {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMall, setEditingMall] = useState<Mall | null>(null);
  const [formData, setFormData] = useState<Partial<Mall>>({
    mallName: '',
    location: '',
    category: 'REGIONAL',
  });
  const [formErrors, setFormErrors] = useState<Partial<Mall>>({});

  const fetchMalls = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllMalls();
      setMalls(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch malls');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMalls();
  }, []);

  const handleOpenCreate = () => {
    setEditingMall(null);
    setFormData({ mallName: '', location: '', category: 'REGIONAL' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (mall: Mall) => {
    setEditingMall(mall);
    setFormData({
      mallName: mall.mallName,
      location: mall.location,
      category: mall.category,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (mall: Mall) => {
    if (!mall.id || !confirm(`Are you sure you want to delete ${mall.mallName}?`)) return;
    try {
      await apiService.deleteMall(mall.id);
      fetchMalls();
    } catch (err) {
      alert('Failed to delete mall');
    }
  };

  const validateForm = () => {
    const errors: Partial<Mall> = {};
    if (!formData.mallName?.trim()) errors.mallName = 'Mall name is required';
    if (!formData.location?.trim()) errors.location = 'Location is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingMall) {
        await apiService.updateMall(editingMall.id!, formData as Mall);
      } else {
        await apiService.createMall(formData as Mall);
      }
      setIsModalOpen(false);
      fetchMalls();
    } catch (err) {
      alert('Failed to save mall');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'mallName' as keyof Mall },
    { header: 'Location', accessor: 'location' as keyof Mall },
    { header: 'Category', accessor: 'category' as keyof Mall },
  ];

  return (
    <div>
      <PageHeader
        title="Malls"
        description="Manage shopping malls"
        action={
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Mall
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
          data={malls}
          columns={columns}
          keyAccessor={(mall) => mall.id!}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No malls found. Click 'Add Mall' to create one."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMall ? 'Edit Mall' : 'Create Mall'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Mall Name"
            value={formData.mallName || ''}
            onChange={(e) => setFormData({ ...formData, mallName: e.target.value })}
            error={formErrors.mallName}
            placeholder="Enter mall name"
          />
          <FormInput
            label="Location"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            error={formErrors.location}
            placeholder="Enter location"
          />
          <FormSelect
            label="Category"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as 'REGIONAL' | 'SUPERREGIONAL' })}
            options={[
              { value: 'REGIONAL', label: 'Regional' },
              { value: 'SUPERREGIONAL', label: 'Super Regional' },
            ]}
            placeholder="Select category"
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
              {editingMall ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}