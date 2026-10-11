import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { Orders, OrderDetail } from './pages/Orders';
import { Memberships } from './pages/Memberships';
import { Guest } from './pages/Guest';
import { Finance } from './pages/Finance';
import { CheckIn } from './pages/CheckIn';
import { ManageEvents } from './pages/ManageEvents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        
        <Route path="/products" element={<Products />} />
        
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        
        <Route path="/memberships" element={<Memberships />} />
        
        <Route path="/guest" element={<Guest />} />
        
        <Route path="/finance" element={<Finance />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/manage/events" element={<ManageEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
