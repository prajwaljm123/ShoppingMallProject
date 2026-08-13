import type { ReactNode } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Malls', href: '/malls', icon: '🏢' },
  { name: 'Shops', href: '/shops', icon: '🏪' },
  { name: 'Items', href: '/items', icon: '📦' },
  { name: 'Customers', href: '/customers', icon: '👥' },
  { name: 'Orders', href: '/orders', icon: '📋' },
  { name: 'Employees', href: '/employees', icon: '👨‍💼' },
  { name: 'Shop Owners', href: '/shop-owners', icon: '👤' },
  { name: 'Mall Admins', href: '/mall-admins', icon: '🛡️' },
];

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 relative">
        <div className="p-6 border-b border-gray-200/50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 flex items-center gap-2">
            <span className="text-2xl filter drop-shadow-sm">🛍️</span> Mall Central
          </h1>
        </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NavLink
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-700 shadow-sm border border-indigo-100'
                        : 'text-gray-500 hover:bg-white/60 hover:text-gray-900 border border-transparent'
                    }`}
                  >
                    <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>
          
          <div className="mt-auto p-6 border-t border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                AD
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500 font-medium">Store Manager</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto relative">
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
          
          <div className="p-8 max-w-7xl mx-auto relative z-0 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="pb-12"
              >
                {children}
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
    </div>
  );
}