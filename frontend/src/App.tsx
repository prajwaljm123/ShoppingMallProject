import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { Dashboard } from './pages/dashboard';
import { MallList, MallDetail } from './pages/malls';
import { ShopList, ShopDetail } from './pages/shops';
import { ItemList } from './pages/items';
import { CustomerList } from './pages/customers';
import { OrderList } from './pages/orders';

import { EmployeeList } from './pages/employees';
import { ShopOwnerList } from './pages/shop-owners';
import { MallAdminList } from './pages/mall-admins';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/malls" element={<MallList />} />
          <Route path="/malls/:id" element={<MallDetail />} />
          <Route path="/shops" element={<ShopList />} />
          <Route path="/shops/:id" element={<ShopDetail />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/shop-owners" element={<ShopOwnerList />} />
          <Route path="/mall-admins" element={<MallAdminList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;