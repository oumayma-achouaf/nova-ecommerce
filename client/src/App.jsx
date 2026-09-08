import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'

import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'

import Home from './pages/shop/Home.jsx'
import NewArrivals from './pages/shop/NewArrivals.jsx'
import Men from './pages/shop/Men.jsx'
import Women from './pages/shop/Women.jsx'
import Accessories from './pages/shop/Accessories.jsx'
import ProductDetails from './pages/shop/ProductDetails.jsx'
import Search from './pages/shop/Search.jsx'
import Cart from './pages/shop/Cart.jsx'
import Checkout from './pages/shop/Checkout.jsx'
import PaymentReturn from './pages/shop/PaymentReturn.jsx'

import Profile from './pages/account/Profile.jsx'
import Orders from './pages/account/Orders.jsx'
import OrderDetails from './pages/account/OrderDetails.jsx'
import Addresses from './pages/account/Addresses.jsx'
import Favorites from './pages/account/Favorites.jsx'
import Security from './pages/account/Security.jsx'

import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'

import './styles/shop.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="app-shell">

            <Header />

            <Routes>

              {/* =========================
                  SHOP
              ========================= */}

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/nouveautes"
                element={<NewArrivals />}
              />

              <Route
                path="/homme"
                element={<Men />}
              />

              <Route
                path="/femme"
                element={<Women />}
              />

              <Route
                path="/accessoires"
                element={<Accessories />}
              />

              <Route
                path="/produit/:slug"
                element={<ProductDetails />}
              />

              <Route
                path="/recherche"
                element={<Search />}
              />

              <Route
                path="/panier"
                element={<Cart />}
              />

              <Route
                path="/checkout"
                element={<Checkout />}
              />

              <Route
                path="/paiement/succes"
                element={
                  <PaymentReturn status="success" />
                }
              />

              <Route
                path="/paiement/annule"
                element={
                  <PaymentReturn status="cancelled" />
                }
              />

              {/* =========================
                  COMPTE CLIENT
              ========================= */}

              <Route
                path="/mon-compte"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/mon-compte/commandes"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />

              <Route
                path="/mon-compte/commandes/:id"
                element={
                  <PrivateRoute>
                    <OrderDetails />
                  </PrivateRoute>
                }
              />

              <Route
                path="/mon-compte/adresses"
                element={
                  <PrivateRoute>
                    <Addresses />
                  </PrivateRoute>
                }
              />

              <Route
                path="/mon-compte/favoris"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />

              <Route
                path="/mon-compte/securite"
                element={
                  <PrivateRoute>
                    <Security />
                  </PrivateRoute>
                }
              />

              {/* =========================
                  AUTH
              ========================= */}

              <Route
                path="/connexion"
                element={<Login />}
              />

              <Route
                path="/inscription"
                element={<Register />}
              />

              <Route
                path="/mot-de-passe-oublie"
                element={<ForgotPassword />}
              />

              <Route
                path="/reinitialiser-mot-de-passe"
                element={<ResetPassword />}
              />

              <Route
                path="/reinitialiser-mot-de-passe/:token"
                element={<ResetPassword />}
              />

              {/* =========================
                  FALLBACK
              ========================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>

              <Footer />

            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
