import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProductsStore } from "@/store/useProductsStore";
import { Loader2, TrendingUp, DollarSign, Package, Trash2, X } from "lucide-react";
import dayjs from "dayjs";

const DailySales = () => {
  const {
    products,
    isLoading,
    getDailyproducts,
    deleteProduct,
    date
  } = useProductsStore();

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    getDailyproducts();
  }, [getDailyproducts]);

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteProduct(deleteConfirmId);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const totalSales = products.reduce((sum, product) => {
    const quantity = product.quantity ?? 1;
    const price = product.price ?? 0;
    return sum + price * quantity;
  }, 0);

  const averagePrice = products.length > 0 ? totalSales / products.length : 0;

  const statCards = [
    {
      title: "Total Products",
      value: products.length,
      icon: <Package className="text-white" size={20} />,
      gradient: "from-indigo-600 to-indigo-500",
      bgColor: "bg-indigo-700",
    },
    {
      title: "Today's Sales",
      value: `$${totalSales.toFixed(2)}`,
      icon: <DollarSign className="text-white" size={20} />,
      gradient: "from-purple-600 to-purple-500",
      bgColor: "bg-purple-700",
    },
    {
      title: "Avg. Price",
      value: `$${averagePrice.toFixed(2)}`,
      icon: <TrendingUp className="text-white" size={20} />,
      gradient: "from-pink-600 to-pink-500",
      bgColor: "bg-pink-700",
    },
  ];

  useEffect(() => {
  const today = dayjs().format("DD-MM-YYYY");
  if (date !== today) {
    getDailyproducts();
  }
}, [date, getDailyproducts]);


  return (
    <motion.div
      className="min-h-screen bg-transparent to-gray-900 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition flex items-center"
              >
                <X className="mr-2" size={18} /> Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition flex items-center"
              >
                <Trash2 className="mr-2" size={18} />
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.gradient} rounded-xl p-4 md:p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 font-medium text-sm md:text-base">{card.title}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1 md:mt-2">{card.value}</h3>
                </div>
                <div className={`${card.bgColor} p-2 md:p-3 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sales Table */}
        <motion.div
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-2 md:mr-3" size={24} />
                  Today's Sales
                </h2>
                <p className="text-gray-300 text-sm md:text-base mt-1">
                  {date || "Daily sales overview"}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-white" size={40} />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-gray-900 rounded-xl shadow-lg p-6 md:p-8 text-center">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-white">No Sales Recorded Today</h3>
                  <p className="mt-2 text-gray-400">
                    You haven't made any sales today. Start adding products to track your daily sales.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Product</th>
                      <th className="py-3 px-4 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">Description</th>
                      <th className="py-3 px-4 text-right text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Qty</th>
                      <th className="py-3 px-4 text-right text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="py-3 px-4 text-right text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Total</th>
                      <th className="py-3 px-4 text-right text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {products.map((product, index) => {
                      const quantity = product.quantity ?? 1;
                      const price = product.price ?? 0;
                      const total = quantity * price;

                      return (
                        <motion.tr
                          key={product._id ?? `product-${index}`}
                          className="hover:bg-white hover:bg-opacity-5 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <td className="py-4 px-4 whitespace-nowrap">
                            {editingId === product._id ? (
                              <input
                                type="text"
                                value={editForm.name || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, name: e.target.value })
                                }
                                className="bg-gray-700 text-white px-3 py-1 rounded w-full max-w-[200px]"
                              />
                            ) : (
                              <div className="text-sm font-medium text-white">
                                {product.name}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300 hidden sm:table-cell truncate max-w-[200px]">
                            {editingId === product._id ? (
                              <input
                                type="text"
                                value={editForm.description || ""}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, description: e.target.value })
                                }
                                className="bg-gray-700 text-white px-3 py-1 rounded w-full"
                              />
                            ) : (
                              product.description
                            )}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-right text-sm text-white">
                            {quantity}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-right text-sm text-white">
                            {editingId === product._id ? (
                              <input
                                type="number"
                                value={editForm.price ?? 0}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, price: Number(e.target.value) })
                                }
                                className="bg-gray-700 text-white px-3 py-1 rounded w-20 text-right"
                              />
                            ) : (
                              `$${price.toFixed(2)}`
                            )}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium text-emerald-400">
                            ${total.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleDeleteClick(product._id)}
                                className="text-red-400 hover:text-red-200 transition-colors p-1 rounded"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DailySales;
