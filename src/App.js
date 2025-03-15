import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/Main';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import OfferDetails from './components/OfferDetails';
import ProductDetail from './pages/productDetail';
import Admin from './pages/Admin';
import './css/style.css';
import Register from './pages/Register';
import Chat from './pages/ChatPage';
import OfferShow from './components/OfferShow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main/:id" element={<MainPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/offers/:offerId" element={<OfferDetails />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/admin/:id" element={<Admin />} />
        <Route path="/offershow/:offerId" element={<OfferShow />} />
        

      </Routes>
    </Router>
  );
}

export default App;
