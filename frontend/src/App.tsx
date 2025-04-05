import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ShoppingCart from './pages/ShoppingCart';
import { CartProvider } from './context/CartContext';
import AdminBookPage from './pages/AdminBookPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/adminbooks" element={<AdminBookPage/>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App
