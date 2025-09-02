import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import { useUserStore } from './store/useUserStore';
import Dashboard from './pages/Dashboard';
import FinancialLogForm from './components/Admin/FinancialLog';
import FinancialLogDate from './components/Admin/GetFinancialDate';
import CreateProduct from './components/products/CreateProduct';
import Categories from './components/categories/CreateCategories';
import GetProducts from './components/products/GetProducts';

const App = () => {
  const { checkAuth, user, isLoading, authChecked } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading || !authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader className="animate-spin text-white" size={40} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 bg-gray-900" />
      {/* <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700" /> */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="relative z-10 pt-14 px-4 min-h-screen">
        <Routes>
          <Route path="/" element={user ? <Homepage /> : <Navigate to="/signin" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user?.role === "admin" ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/FinancialLogForm" element={user?.role === "admin" ? <FinancialLogForm /> : <Navigate to="/" />} />
          <Route path="/createProduct" element={user?.role === "admin" ? <CreateProduct /> : <Navigate to="/" />} />
          <Route path="/products" element={user?.role === "admin" ? <GetProducts /> : <Navigate to="/" />} />
          <Route path="/categories" element={user?.role === "admin" ? <Categories /> : <Navigate to="/" />} />
          <Route path="/FinancialLogDate" element={user?.role === "admin" ? <FinancialLogDate /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster position="top-center" />
      </div>
  );
};

export default App;
