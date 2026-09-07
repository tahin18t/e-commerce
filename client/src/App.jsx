import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import CartListPage from "./pages/CartListPage"
import ProductPage from './pages/ProductPage'
import ProfilePage from './pages/ProfilePage'
import NotFound from './pages/NotFound'
import ProductListPage from './pages/ProductListPage'
import WishListPage from './pages/WishListPage'
import PaymentResultPage from './pages/PaymentResultPage'
import OrderConfirmedPage from './pages/OrderConfirmedPage'
import PurchaseHistory from './pages/PurchaseHistory'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/cart' element={<CartListPage />} />
        <Route path='/wish' element={<WishListPage />} />
        <Route path='/product/:productID' element={<ProductPage />} />
        <Route path='/products' element={<ProductListPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/history' element={<PurchaseHistory />} />
        <Route path='/payment-result/:status?/:trxID?' element={<PaymentResultPage />} />
        <Route path='/order-confirmed/:trxID' element={<OrderConfirmedPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
