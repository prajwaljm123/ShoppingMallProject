import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';
import type { Mall, Shop } from '../../types';
import { PageHeader, DataTable } from '../../components';

export function MallDetail() {
  const { id } = useParams<{ id: string }>();
  const [mall, setMall] = useState<Mall | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [mallData, shopsData] = await Promise.all([
          apiService.getMallById(Number(id)),
          apiService.getShopsByMall(Number(id)),
        ]);
        setMall(mallData);
        setShops(shopsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch mall details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const shopColumns = [
    { header: 'Name', accessor: 'shopName' as keyof Shop },
    { header: 'Category', accessor: 'shopCategory' as keyof Shop },
    { header: 'Status', accessor: 'shopStatus' as keyof Shop },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error || !mall) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Mall not found'}</p>
        <Link to="/malls" className="mt-4 text-indigo-600 hover:underline">
          Back to Malls
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/malls"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Malls
        </Link>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">{mall.mallName}</h1>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{mall.location}</p>
            </div>
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium capitalize">{mall.category?.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-gray-500">Shops</p>
              <p className="font-medium">{shops.length}</p>
            </div>
          </div>
        </div>
      </div>

      <PageHeader
        title="Shops in this Mall"
        description={`${shops.length} shop(s) found`}
      />

      <DataTable
        data={shops}
        columns={shopColumns}
        keyAccessor={(shop) => shop.shopId!}
        onView={(shop) => window.location.href = `/shops/${shop.shopId}`}
        emptyMessage="No shops in this mall yet."
      />
    </div>
  );
}