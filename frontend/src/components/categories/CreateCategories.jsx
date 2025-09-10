import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, List, Edit, Trash2, X, Check } from "lucide-react";
import useCategoryStore from "../../store/useCategoryStore";

const API_BASE = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Categories = ({ language = "so" }) => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formImage, setFormImage] = useState(null);

  const [editFormData, setEditFormData] = useState({ name: "", description: "" });
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateImageChange = (e) => {
    setFormImage(e.target.files[0]);
  };

  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (formImage) data.append("image", formImage);

    await createCategory(data);
    if (!error) {
      setFormData({ name: "", description: "" });
      setFormImage(null);
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", editFormData.name);
    data.append("description", editFormData.description);
    if (editImage) data.append("image", editImage);

    await updateCategory(editingId, data);
    if (!error) {
      setEditingId(null);
      setEditFormData({ name: "", description: "" });
      setEditImage(null);
    }
  };

  const startEditing = (category) => {
    setEditingId(category._id);
    setEditFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({ name: "", description: "" });
    setEditImage(null);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        language === "so"
          ? "Ma hubtaa inaad rabto inaad tirtirto qaybtan?"
          : "Are you sure you want to delete this category?"
      )
    ) {
      await deleteCategory(id);
    }
  };

  const content = {
    so: {
      title: "Qaybaha Alaabta",
      createButton: "Abuur Qayb Cusub",
      createTitle: "Abuur Qayb Cusub",
      editTitle: "Wax Ka Beddel Qaybta",
      nameLabel: "Magaca Qaybta",
      descriptionLabel: "Sharaxaad",
      imageLabel: "Sawirka",
      cancel: "Jooji",
      save: "Kaydi",
      delete: "Tirtir",
      edit: "Wax Ka Beddel",
      noCategories: "Ma jiro qaybo la keydiyay",
      loading: "Soo dejineysa qaybaha...",
      error: "Khalad ayaa dhacay",
    },
    en: {
      title: "Product Categories",
      createButton: "Create New Category",
      createTitle: "Create New Category",
      editTitle: "Edit Category",
      nameLabel: "Category Name",
      descriptionLabel: "Description",
      imageLabel: "Image",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      noCategories: "No categories saved",
      loading: "Loading categories...",
      error: "An error occurred",
    },
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
                  {language === "so" ? "Maamul qaybaha alaabtaaga" : "Manage your product categories"}
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
                    <div key={category._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 flex items-start space-x-4">
                      {category.imageUrl && (
                        <img
                          src={`${API_BASE}${category.imageUrl}`}
                          alt={category.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        {editingId === category._id ? (
                          <form onSubmit={handleEditSubmit} className="space-y-3">
                            <input
                              type="text"
                              name="name"
                              placeholder={content[language].nameLabel}
                              value={editFormData.name}
                              onChange={handleEditChange}
                              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                              required
                            />
                            <textarea
                              name="description"
                              placeholder={content[language].descriptionLabel}
                              value={editFormData.description}
                              onChange={handleEditChange}
                              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                            />
                            <input type="file" accept="image/*" onChange={handleEditImageChange} />
                            <div className="flex space-x-2">
                              <button type="submit" className="px-4 py-2 bg-green-600 rounded text-white">
                                <Check className="w-4 h-4 mr-1 inline" />
                                {content[language].save}
                              </button>
                              <button type="button" onClick={cancelEditing} className="px-4 py-2 bg-red-600 rounded text-white">
                                <X className="w-4 h-4 mr-1 inline" />
                                {content[language].cancel}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium text-white">{category.name}</h4>
                              {category.description && <p className="text-gray-400 mt-1">{category.description}</p>}
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
                    </div>
                  ))}
                </div>
              )}

              {/* Create Category Modal */}
              <AnimatePresence>
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsCreating(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-xl font-bold text-emerald-400 mb-4">{content[language].createTitle}</h3>
                      <form onSubmit={handleCreateSubmit} className="space-y-3">
                        <input
                          type="text"
                          name="name"
                          placeholder={content[language].nameLabel}
                          value={formData.name}
                          onChange={handleCreateChange}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                          required
                        />
                        <textarea
                          name="description"
                          placeholder={content[language].descriptionLabel}
                          value={formData.description}
                          onChange={handleCreateChange}
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                        />
                        <input type="file" accept="image/*" onChange={handleCreateImageChange} />
                        <div className="flex justify-end space-x-2 mt-3">
                          <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-red-600 rounded text-white">
                            <X className="w-4 h-4 mr-1 inline" />
                            {content[language].cancel}
                          </button>
                          <button type="submit" className="px-4 py-2 bg-green-600 rounded text-white">
                            <Check className="w-4 h-4 mr-1 inline" />
                            {content[language].save}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
