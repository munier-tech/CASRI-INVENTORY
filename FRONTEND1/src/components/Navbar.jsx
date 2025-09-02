import { Link } from "react-router-dom";
import { Lock, LogOut, UserPlus, LogIn, Home, ShoppingBag, Loader } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

const Navbar = () => {
  const { user, isLoading, dashboardAdmin, signOut } = useUserStore();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="fixed w-full top-0 bg-white/5 backdrop-blur-xl z-50 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <Link to="/" className="flex flex-col">
              <h1 className="text-2xl font-bold bg-white text-transparent bg-clip-text">
                CASRI
              </h1>
              <p className="text-2xl font-bold bg-white text-transparent bg-clip-text -mt-2">
                ELECTRONICS
              </p>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <Home className="mr-1" size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {user && dashboardAdmin() && (
              <>
                <Link
                  to="/DailySales"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <ShoppingBag className="mr-1" size={18} />
                  <span className="hidden sm:inline">Sales</span>
                </Link>

                <Link
                  to="/Dashboard"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors"
                >
                  <Lock className="mr-1" size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </>
            )}


            {user ? (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50 ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <Loader className="animate-spin mr-1" size={18} />
                ) : (
                  <LogOut className="mr-1" size={18} />
                )}
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  <UserPlus className="mr-1" size={18} />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>

                <Link
                  to="/signin"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="mr-1" size={18} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
