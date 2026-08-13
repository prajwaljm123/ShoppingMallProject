import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api';
import type { OrderDetails } from '../../types';

const statCards = [
  { name: 'Total Malls', icon: '🏢', color: 'from-emerald-400 to-teal-500', href: '/malls', prefix: '', suffix: '', multiplier: 1 },
  { name: 'Total Shops', icon: '🏪', color: 'from-blue-400 to-indigo-500', href: '/shops', prefix: '', suffix: '', multiplier: 1 },
  { name: 'Listed Items', icon: '📦', color: 'from-purple-400 to-pink-500', href: '/items', prefix: '', suffix: '', multiplier: 1 },
  { name: 'Total Customers', icon: '👥', color: 'from-orange-400 to-rose-500', href: '/customers', prefix: '', suffix: '', multiplier: 1 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Dashboard() {
  const [stats, setStats] = useState({
    malls: 0,
    shops: 0,
    items: 0,
    customers: 0,
    orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [malls, shops, items, customers, orders] = await Promise.all([
          apiService.getAllMalls(),
          apiService.getAllShops(),
          apiService.getAllItems(),
          apiService.getAllCustomers(),
          apiService.getAllOrders(),
        ]);
        setStats({
          malls: malls.length,
          shops: shops.length,
          items: items.length,
          customers: customers.length,
          orders: orders.length,
        });
        setRecentOrders(orders.slice(-5).reverse());
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white tracking-tight">Mall Dashboard</h1>
          <p className="text-indigo-200 mt-2 text-lg max-w-2xl">Monitor your mall's performance, track shops, and manage operations all in one place.</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse h-32">
              <div className="h-4 bg-gray-200/50 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200/50 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {statCards.map((card) => {
              // Map realistic stats to our existing counts
              let displayValue = 0;
              if (card.name === 'Total Malls') displayValue = stats.malls;
              if (card.name === 'Total Shops') displayValue = stats.shops;
              if (card.name === 'Listed Items') displayValue = stats.items;
              if (card.name === 'Total Customers') displayValue = stats.customers;

              return (
                <motion.div key={card.name} variants={itemVariants}>
                  <Link
                    to={card.href}
                    className="block glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
                    <div className="flex flex-col h-full relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20`}>
                          {card.icon}
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{card.name}</p>
                        <p className="text-3xl font-black text-gray-900 mt-1 flex items-baseline gap-1">
                          {card.prefix}{displayValue.toFixed(card.name === 'Total Revenue' ? 1 : 0)}{card.suffix}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200/50 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
              <Link to="/orders" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              {recentOrders.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No orders yet</div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Store</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    className="divide-y divide-gray-100/50 bg-white/30"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {recentOrders.map((order) => (
                      <motion.tr variants={itemVariants} key={order.id} className="hover:bg-white/80 transition-colors">
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-indigo-600">#{order.id}</td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
                              {(order.customer?.customerName || 'U').charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{order.customer?.customerName || 'Guest User'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {order.shop?.shopName || 'Independent Shop'}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                          ${order.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-700">
                            Completed
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}