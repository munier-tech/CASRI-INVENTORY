import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Users,
  Home,
  FileText,
  DollarSign,
  User, ArrowUp,
  ArrowDown,
  FileTerminalIcon,
  FileScanIcon,
  PlusCircle,
  ShoppingBasket,
  Calendar,
  Receipt
} from "lucide-react";
import { Link } from "react-router-dom";
import useProductsStore from "../store/useProductsStore";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState("so"); // 'so' for Somali, 'en' for English
  const { products } = useProductsStore();

  // Language content
  const content = {
    so: {
      dashboard: "Dashboard",
      tabs: {
        dashboard: "Dashboard",
        products: "Alaabta",
        categories : "Qeybta Alaabta",
        sales: "Iibka",
        users: "Isticmaalayaasha",
        financial: "Maaliyadda"
      },
      subtabs: {
        createProduct: "Abuur Alaab",
        createCategory: "Abuur Qayb Cusub",
        productList: "Liiska Alaabta",
        dailySales: "Iibka Maanta",
        salesByDate: "Iibka Taariikhda",
        userDailySales: "Iibka Isticmaalaha Maanta",
        userSalesByDate: "Iibka Isticmaalaha Taariikhda",
        financialLog: "Diiwaanka Maaliyadda",
        financialHistory: "Taariikhda Maaliyadda"
      },
      stats: [
        { title: "Amaahda Maanta", value: "Amaah", change: "#" },
        { title: "Iibka Maanta", value: "$0", change: "$" },
        { title: "Shaqaalaha", value: "Shaqaalaha" },
        { title: "Taariikhda", value: "Taariikhda" },
        { title: "Taariikhda Iibka", value: "Iibka" },
        { title: "Taariikhda Amaahda", value: "Amaah" },
        { title: "Xisaab Xidhka", value: "Xisaab" },
        { title: "Taariikhda Xisaabta", value: "Xisaab" }
      ]
    },
    en: {
      dashboard: "Dashboard",
      tabs: {
        dashboard: "Dashboard",
        products: "Products",
        sales: "Sales",
        users: "Users",
        financial: "Financial"
      },
      subtabs: {
        createProduct: "Create Product",
        productList: "Product List",
        dailySales: "Daily Sales",
        salesByDate: "Sales by Date",
        userDailySales: "User Daily Sales",
        userSalesByDate: "User Sales by Date",
        financialLog: "Financial Log",
        financialHistory: "Financial History"
      },
      stats: [
        { title: "Today's Liability", value: "Liability", change: "#" },
        { title: "Today's Sales", value: "$0", change: "$" },
        { title: "Staff", value: "Staff" },
        { title: "History", value: "History" },
        { title: "Sales History", value: "Sales" },
        { title: "Liability History", value: "Liability" },
        { title: "Accounting", value: "Accounting" },
        { title: "Accounting History", value: "Accounting" }
      ]
    }
  };

  const totalSales = products.reduce((sum, product) => {
    const quantity = product.quantity ?? 1;
    return sum + product.price * quantity;
  }, 0);

  // Update the value for today's sales
  content.so.stats[1].value = `$${totalSales}`;
  content.en.stats[1].value = `$${totalSales}`;

  const stats = [
    { icon: <DollarSign size={20} />, path: "/DialyLiability" },
    { icon: <ShoppingCart size={20} />, path: "/DailySales" },
    { icon: <Users size={20} />, path: "/UserProducts" },
    { icon: <Users size={20} />, path: "/UserProductsByDate" },
    { icon: <FileText size={20} />, path: "/HistorySalesDate" },
    { icon: <FileText size={20} />, path: "/HistoryLiabilityByDate" },
    { icon: <FileTerminalIcon size={20} />, path: "/FinancialLogForm" },
    { icon: <FileTerminalIcon size={20} />, path: "/FinancialLogDate" },
  ];

  const tabs = [
    { 
      id: "dashboard", 
      label: content[language].tabs.dashboard, 
      icon: Home,
      content: <DashboardContent language={language} />
    },
    { 
      id: "products", 
      label: content[language].tabs.products, 
      icon: ShoppingBasket,
      subtabs: [
        { id: "create", label: content[language].subtabs.createProduct, icon: PlusCircle, path: "/createProduct" },
        { id: "list", label: content[language].subtabs.productList, icon: ShoppingBasket, path: "/products" },
      ]
    },
    { 
      id: "categories", 
      label: content[language].tabs.categories, 
      icon: ShoppingBasket,
      subtabs: [
        { id: "create", label: content[language].subtabs.createCategory, icon: PlusCircle, path: "/categories" },
      ]
    },
    { 
      id: "sales", 
      label: content[language].tabs.sales, 
      icon: ShoppingCart,
      subtabs: [
        { id: "daily", label: content[language].subtabs.dailySales, icon: Calendar, path: "/DailySales" },
        { id: "history", label: content[language].subtabs.salesByDate, icon: FileText, path: "/HistorySalesDate" },
      ]
    },
    { 
      id: "users", 
      label: content[language].tabs.users, 
      icon: User,
      subtabs: [
        { id: "userDaily", label: content[language].subtabs.userDailySales, icon: Receipt, path: "/UserProducts" },
        { id: "userHistory", label: content[language].subtabs.userSalesByDate, icon: FileText, path: "/UserProductsByDate" },
      ]
    },
    { 
      id: "financial", 
      label: content[language].tabs.financial, 
      icon: FileTerminalIcon,
      subtabs: [
        { id: "financialLog", label: content[language].subtabs.financialLog, icon: FileScanIcon, path: "/FinancialLogForm" },
        { id: "financialHistory", label: content[language].subtabs.financialHistory, icon: FileScanIcon, path: "/FinancialLogDate" },
      ]
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-emerald-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {content[language].dashboard}
          </motion.h1>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => setLanguage("so")}
              className={`px-3 py-1 rounded-md transition-colors ${
                language === "so" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              SO
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-md transition-colors ${
                language === "en" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tab Navigation */}
          <div className="w-full lg:w-64 bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700">
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <div key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? "bg-emerald-600 text-white"
                        : "text-gray-300 hover:text-emerald-400 hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                  
                  {/* Subtabs */}
                  {activeTab === tab.id && tab.subtabs && (
                    <div className="ml-8 mt-2 flex flex-col gap-2">
                      {tab.subtabs.map((subtab) => (
                        <Link
                          key={subtab.id}
                          to={subtab.path}
                          className="flex items-center gap-3 p-2 rounded-xl text-gray-300 hover:text-emerald-400 hover:bg-gray-700 transition-colors"
                        >
                          <subtab.icon size={16} />
                          <span className="text-sm">{subtab.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "dashboard" && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <Link to={stat.path} key={index}>
                      <motion.div 
                        className="bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-400">
                              {content[language].stats[index].title}
                            </p>
                            <p className="text-2xl font-bold mt-1 text-white">
                              {content[language].stats[index].value}
                            </p>
                          </div>
                          <div className={`p-2 rounded-lg ${
                            content[language].stats[index].change && content[language].stats[index].change.includes('+') 
                              ? "bg-emerald-900/30 text-emerald-400" 
                              : "bg-gray-700 text-emerald-400"
                          }`}>
                            {stat.icon}
                          </div>
                        </div>
                        {content[language].stats[index].change && (
                          <div className="flex items-center mt-4">
                            {content[language].stats[index].change.includes('+') ? (
                              <ArrowUp size={16} className="text-emerald-400" />
                            ) : (
                              <ArrowDown size={16} className="text-red-400" />
                            )}
                            <span className={`text-sm ml-1 ${
                              content[language].stats[index].change.includes('+') 
                                ? "text-emerald-400" 
                                : "text-red-400"
                            }`}>
                              {content[language].stats[index].change}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Additional Dashboard Content */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {language === "so" ? "Soo dhawoow Dashboard-ka" : "Welcome to your Dashboard"}
                  </h2>
                  <p className="text-gray-300">
                    {language === "so" 
                      ? "Halkan waxaad ka heli kartaa macluumaadka guud ee ganacsigaaga iyo xogta dhaqaale." 
                      : "Here you can find an overview of your business and financial data."}
                  </p>
                </div>
              </div>
            )}

            {activeTab !== "dashboard" && (
              <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-gray-300">
                  {language === "so" 
                    ? "Dooro qeybta hoose ee aad rabto inaad wax ka qabato." 
                    : "Select a sub-tab to perform operations."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ language }) => {
  return (
    <div>
      <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          {language === "so" ? "Warbixinta Guud" : "General Report"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              {language === "so" ? "Dhaqaale" : "Finance"}
            </h3>
            <p className="text-gray-300">
              {language === "so" 
                ? "Halkan waxaad arki kartaa dhaqaalahaga guud" 
                : "View your overall financial status here"}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              {language === "so" ? "Alaabta" : "Products"}
            </h3>
            <p className="text-gray-300">
              {language === "so" 
                ? "Maareynta alaabtaaga iyo bakhaarrada" 
                : "Manage your products and inventory"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;