import React, { useState } from "react";
import { Package, Edit2, Trash2, Plus, Search } from "lucide-react";
import { updatedInventory } from "./data";

function App() {
  const [inventory, setInventory] = useState(updatedInventory);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", ...new Set(inventory.map((item) => item.category))];

  const handleAddItem = (newItem) => {
    setInventory([...inventory, { ...newItem, id: Date.now().toString() }]);
    setIsModalOpen(false);
  };

  const handleEditItem = (item) => {
    setInventory(inventory.map((i) => (i.id === item.id ? item : i)));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const filteredInventory = inventory
    .filter(
      (item) =>
        selectedCategory === "All" || item.category === selectedCategory
    )
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Store Inventory</h1>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-3 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="border-2 border-indigo-500 rounded-lg px-4 py-2 hover:bg-indigo-100 transition-all duration-300"
            >
              Sort by Quantity {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md"
            />
          </div>
        </div>

        {/* Inventory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-lg shadow-lg bg-white ${
                item.quantity < 10 ? "border-2 border-red-300" : "border-2 border-gray-300"
              } hover:shadow-xl transition-all duration-300`}
            >
              <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span> {item.category}
              </p>
              <p
                className={`mt-2 px-2 py-1 rounded-full text-sm inline-block ${
                  item.quantity < 10
                    ? "bg-red-100 text-red-800"
                    : "bg-indigo-100 text-indigo-800"
                }`}
              >
                Quantity: {item.quantity}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-semibold">Price:</span> ${item.price}
              </p>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-9 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingItem ? "Edit Product" : "Add New Product"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const item = {
                  name: formData.get("name"),
                  category: formData.get("category"),
                  quantity: parseInt(formData.get("quantity")),
                  price: parseFloat(formData.get("price")),
                  description: formData.get("description"),
                };
                
                // Check if form data is valid
                if (
                  item.name && item.category && !isNaN(item.quantity) &&
                  !isNaN(item.price) && item.description
                ) {
                  if (editingItem) {
                    handleEditItem({ ...item, id: editingItem.id });
                  } else {
                    handleAddItem(item);
                  }
                } else {
                  alert("Please fill in all fields correctly.");
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    defaultValue={editingItem?.name}
                    required
                    className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    name="category"
                    defaultValue={editingItem?.category}
                    required
                    className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    name="quantity"
                    defaultValue={editingItem?.quantity}
                    required
                    type="number"
                    min="0"
                    className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    name="price"
                    defaultValue={editingItem?.price}
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description}
                    required
                    className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-500 text-white rounded-md"
                >
                  {editingItem ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
