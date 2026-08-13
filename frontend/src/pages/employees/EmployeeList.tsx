import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { Employee, Shop } from '../../types';
import { DataTable, PageHeader, Modal, FormInput, FormSelect } from '../../components';

interface EmployeeFormData {
  name: string;
  dob: string;
  salary: number;
  address: string;
  designation: string;
  shop: Shop | undefined;
}

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    dob: '',
    salary: 0,
    address: '',
    designation: '',
    shop: undefined,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shopsData, empData] = await Promise.all([
        apiService.getAllShops(),
        apiService.getAllEmployees()
      ]);
      setShops(shopsData);
      setEmployees(empData);
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
    setEditingEmployee(null);
    setFormData({ name: '', dob: '', salary: 0, address: '', designation: '', shop: undefined });
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      dob: employee.dob,
      salary: employee.salary,
      address: employee.address,
      designation: employee.designation,
      shop: employee.shop,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        shop: { shopId: formData.shop?.shopId } as Shop
      };
      
      // Need cast since type has string | undefined types but API requires matching properties
      if (editingEmployee) {
        await apiService.updateEmployee(editingEmployee.id!, payload as any);
      } else {
        await apiService.createEmployee(payload as any);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save employee');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Employee },
    { header: 'Designation', accessor: 'designation' as keyof Employee },
    { header: 'Salary', accessor: 'salary' as keyof Employee },
    { header: 'Shop', accessor: (emp: Employee) => emp.shop?.shopName || 'N/A' },
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage employees"
        action={
          <button onClick={handleOpenCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2">
            <PlusIcon className="w-5 h-5" /> Add Employee
          </button>
        }
      />
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <DataTable
          data={employees}
          columns={columns}
          keyAccessor={(emp) => emp.id!}
          onEdit={handleEdit}
          emptyMessage="No employees found."
        />
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? 'Edit Employee' : 'Create Employee'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <FormInput label="DOB" type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
          <FormInput label="Salary" type="number" value={formData.salary.toString()} onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value)})} />
          <FormInput label="Designation" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} />
          <FormInput label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <FormSelect
            label="Shop"
            value={formData.shop?.shopId?.toString() || ''}
            onChange={(e) => {
              const shopId = Number(e.target.value);
              setFormData({ ...formData, shop: shops.find(s => s.shopId === shopId) });
            }}
            options={shops.map(s => ({ value: s.shopId!.toString(), label: s.shopName }))}
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
