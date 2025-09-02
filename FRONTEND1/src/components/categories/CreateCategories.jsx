import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, List, Edit, Trash2, X, Check } from "lucide-react";
import useCategoryStore from "../../store/useCategoryStore";

const Categories = ({ language = "so" }) => {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await createCategory(formData);
    if (!error) {
      setFormData({ name: "", description: "" });
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateCategory(editingId, editFormData);
    if (!error) {
      setEditingId(null);
      setEditFormData({ name: "", description: "" });
    }
  };

  const startEditing = (category) => {
    setEditingId(category._id);
    setEditFormData({
      name: category.name,
      description: category.description || ""
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({ name: "", description: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === "so" 
      ? "Ma hubtaa inaad rabto inaad tirtirto qaybtan?" 
      : "Are you sure you want to delete this category?")) {
      await deleteCategory(id);
    }
  };

  // Language content
  const content = {
    so: {
      title: "Qaybaha Alaabta",
      createButton: "Abuur Qayb Cusub",
      createTitle: "Abuur Qayb Cusub",
      editTitle: "Wax Ka Beddel Qaybta",
      nameLabel: "Magaca Qaybta",
      descriptionLabel: "Sharaxaad",
      cancel: "Jooji",
      save: "Kaydi",
      delete: "Tirtir",
      edit: "Wax Ka Beddel",
      noCategories: "Ma jiro qaybo la keydiyay",
      loading: "Soo dejineysa qaybaha...",
      error: "Khalad ayaa dhacay"
    },
    en: {
      title: "Product Categories",
      createButton: "Create New Category",
      createTitle: "Create New Category",
      editTitle: "Edit Category",
      nameLabel: "Category Name",
      descriptionLabel: "Description",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      noCategories: "No categories saved",
      loading: "Loading categories...",
      error: "An error occurred"
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-900/20 p-3 rounded-lg mr-4">
                <List className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content[language].title}</h2>
                <p className="text-gray-400">
                  {language === "so" 
                    ? "Maamul qaybaha alaabtaaga" 
                    : "Manage your product categories"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              {content[language].createButton}
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Create Category Form */}
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{content[language].createTitle}</h3>
                <form onSubmit={handleCreateSubmit}>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {content[language].nameLabel}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleCreateChange}
                        required
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === "so" ? "Geli magaca qaybta" : "Enter category name"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {content[language].descriptionLabel}
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleCreateChange}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === "so" ? "Geli sharaxaad (ikhtiyaari)" : "Enter description (optional)"}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg"
                    >
                      {content[language].cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {language === "so" ? "Kaydinaya..." : "Saving..."}
                        </div>
                      ) : (
                        content[language].save
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Categories List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === "so" ? "Qaybaha Hadda Jira" : "Existing Categories"}
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">{content[language].loading}</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 bg-gray-700 rounded-lg">
                  <List className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">{content[language].noCategories}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      {editingId === category._id ? (
                        // Edit Form
                        <form onSubmit={handleEditSubmit}>
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                {content[language].nameLabel}
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditChange}
                                required
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                {content[language].descriptionLabel}
                              </label>
                              <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditChange}
                                rows={2}
                                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="p-2 text-gray-400 hover:text-white"
                            >
                              <X className="h-5 w-5" />
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="p-2 text-green-400 hover:text-green-300"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Display Mode
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-white">{category.name}</h4>
                            {category.description && (
                              <p className="text-gray-400 mt-1">{category.description}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                              {language === "so" 
                                ? `Taariikhda: ${new Date(category.createdAt).toLocaleDateString()}`
                                : `Created: ${new Date(category.createdAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(category)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg"
                              title={content[language].edit}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg"
                              title={content[language].delete}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;