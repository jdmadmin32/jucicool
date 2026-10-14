import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Loader2,
  X,
  RefreshCw,
  Search,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../../types';
import { fetchAdminProducts, updateAdminProduct, createAdminProduct, deleteAdminProduct } from '../../services/api';

export const ProductInventoryTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit / Add Modal
  const [editingProduct, setEditingProduct] = useState<(Product & { extraImagesList?: string[] }) | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // New Product Form
  const [newProd, setNewProd] = useState({
    name: '',
    flavor: '',
    categoryId: 1,
    packSize: '250 ml Bottle',
    packagingType: 'PET Bottle',
    description: '',
    retailPrice: 20.0,
    wholesalePrice: 14.0,
    stockQuantity: 200,
    minWholesaleQty: 100,
    imageUrl: '/images/products/mango-bottle.png',
    shotImageUrl: '/images/products/shot-mango-bottle.png',
    extraImages: [] as string[],
    isActive: 1,
    featured: 0,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleQuickAddStock = async (prodId: number, currentStock: number, addAmount: number) => {
    try {
      await updateAdminProduct(prodId, { stockQuantity: currentStock + addAmount });
      await loadProducts();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const handleToggleActive = async (prod: Product) => {
    try {
      await updateAdminProduct(prod.id, { isActive: prod.is_active === 1 ? 0 : 1 });
      await loadProducts();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleDeleteProduct = async (prodId: number, prodName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prodName}"?\nThis will remove the product and all associated pictures.`)) {
      return;
    }
    setIsDeleting(prodId);
    try {
      await deleteAdminProduct(prodId);
      await loadProducts();
      if (editingProduct && editingProduct.id === prodId) {
        setEditingProduct(null);
      }
    } catch (err: any) {
      alert('Failed to delete product: ' + err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      await updateAdminProduct(editingProduct.id, {
        name: editingProduct.name,
        flavor: editingProduct.flavor,
        packSize: editingProduct.pack_size,
        packagingType: editingProduct.packaging_type,
        retailPrice: editingProduct.retail_price,
        wholesalePrice: editingProduct.wholesale_price,
        stockQuantity: editingProduct.stock_quantity,
        minWholesaleQty: editingProduct.min_wholesale_qty,
        description: editingProduct.description,
        imageUrl: editingProduct.image_url,
        shotImageUrl: editingProduct.shot_image_url,
        isActive: editingProduct.is_active,
        featured: editingProduct.featured,
        extraImages: (editingProduct.extraImagesList || []).filter(Boolean),
      });
      await loadProducts();
      setEditingProduct(null);
    } catch (err: any) {
      alert('Failed to save product updates: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createAdminProduct({
        ...newProd,
        extraImages: newProd.extraImages.filter(Boolean),
      });
      await loadProducts();
      setIsAddModalOpen(false);
      // Reset form
      setNewProd({
        name: '',
        flavor: '',
        categoryId: 1,
        packSize: '250 ml Bottle',
        packagingType: 'PET Bottle',
        description: '',
        retailPrice: 20.0,
        wholesalePrice: 14.0,
        stockQuantity: 200,
        minWholesaleQty: 100,
        imageUrl: '/images/products/mango-bottle.png',
        shotImageUrl: '/images/products/shot-mango-bottle.png',
        extraImages: [],
        isActive: 1,
        featured: 0,
      });
    } catch (err: any) {
      alert('Failed to create product: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.flavor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#E6EBDD] shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products by title or flavor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E6EBDD] focus:outline-none focus:border-[#138443]"
          />
          <Search className="w-4 h-4 text-[#68756B] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#138443] hover:bg-[#0d6131] text-white flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Beverage Item</span>
          </button>
          <button
            onClick={loadProducts}
            className="p-2 text-[#68756B] hover:text-[#138443] rounded-xl hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBDD] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F8F0] text-[#183D2B] font-bold border-b border-[#E6EBDD]">
              <tr>
                <th className="py-3.5 px-4">Item & Packaging</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pack Size</th>
                <th className="py-3.5 px-4 text-right">Retail Price</th>
                <th className="py-3.5 px-4 text-right">Dealer Bulk Price</th>
                <th className="py-3.5 px-4 text-center">Warehouse Stock</th>
                <th className="py-3.5 px-4 text-center">Wholesale MOQ</th>
                <th className="py-3.5 px-4 text-center">Catalog Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBDD]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#68756B]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#138443]" />
                    <span>Loading products inventory...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#68756B]">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isLow = p.stock_quantity < 50;
                  return (
                    <tr key={p.id} className="hover:bg-[#FFFEF7] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.shot_image_url || p.image_url}
                            alt={p.name}
                            className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-[#E6EBDD]"
                          />
                          <div>
                            <div className="font-bold text-[#183D2B]">{p.name}</div>
                            <div className="text-[11px] text-[#138443] font-semibold">{p.flavor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#68756B]">{p.category_name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#183D2B]">{p.pack_size}</div>
                        <div className="text-[10px] text-slate-500">{p.packaging_type}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-extrabold text-[#183D2B] text-sm">₹{p.retail_price.toFixed(2)}</span>
                        <div className="text-[10px] text-[#68756B]">Normal Customer</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-extrabold text-[#138443] text-sm">₹{(p.wholesale_price || 0).toFixed(2)}</span>
                        <div className="text-[10px] text-emerald-700 font-semibold">Dealer / Bulk</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              isLow
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.stock_quantity} units
                          </span>
                          {/* Quick replenish buttons */}
                          <div className="flex gap-1 text-[10px]">
                            <button
                              onClick={() => handleQuickAddStock(p.id, p.stock_quantity, 50)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-[#138443] hover:text-white transition-colors"
                              title="Add 50 units"
                            >
                              +50
                            </button>
                            <button
                              onClick={() => handleQuickAddStock(p.id, p.stock_quantity, 100)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-[#138443] hover:text-white transition-colors"
                              title="Add 100 units"
                            >
                              +100
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-[#F7941D]">{p.min_wholesale_qty}+ units</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] transition-all ${
                            p.is_active === 1
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {p.is_active === 1 ? 'Active (Live)' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingProduct({ ...p, extraImagesList: p.extra_images ? [...p.extra_images] : [] })}
                            className="p-1.5 rounded-xl border border-[#E6EBDD] text-[#138443] hover:bg-[#F4F8F0] shadow-sm"
                            title="Edit Product Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            disabled={isDeleting === p.id}
                            className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 shadow-sm transition-colors"
                            title="Delete Product"
                          >
                            {isDeleting === p.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E6EBDD] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6EBDD]">
              <h3 className="font-bold text-base text-[#183D2B]">Edit Product Details</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-slate-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Flavor / Variety</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.flavor}
                    onChange={(e) => setEditingProduct({ ...editingProduct, flavor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Pack Size</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.pack_size}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pack_size: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={editingProduct.retail_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, retail_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] font-bold text-[#183D2B]"
                  />
                  <span className="text-[10px] text-[#68756B]">Normal Customer rate</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Dealer Bulk Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    required
                    value={editingProduct.wholesale_price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, wholesale_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-bold text-[#138443] bg-emerald-50/50"
                  />
                  <span className="text-[10px] text-emerald-700 font-medium">Logged-in Dealer rate</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Warehouse Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.stock_quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Wholesale MOQ</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.min_wholesale_qty}
                    onChange={(e) => setEditingProduct({ ...editingProduct, min_wholesale_qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                />
              </div>

              {/* Primary Image */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Primary Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.image_url}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Shot / Detail Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.shot_image_url || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shot_image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>
              </div>

              {/* Multiple Extra Images for Edit */}
              <div className="p-3 bg-[#F8FAF5] rounded-2xl border border-[#E6EBDD] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#183D2B] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#138443]" />
                    <span>Multiple Product Pictures ({editingProduct.extraImagesList?.length || 0})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter additional product image URL:');
                      if (url && url.trim()) {
                        setEditingProduct({
                          ...editingProduct,
                          extraImagesList: [...(editingProduct.extraImagesList || []), url.trim()]
                        });
                      }
                    }}
                    className="text-[11px] font-bold text-[#138443] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Picture
                  </button>
                </div>

                {editingProduct.extraImagesList && editingProduct.extraImagesList.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {editingProduct.extraImagesList.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E6EBDD]">
                        <img src={img} alt="Preview" className="w-8 h-8 object-contain rounded bg-slate-50 p-0.5" />
                        <span className="flex-1 truncate text-[11px] text-[#68756B]">{img}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(editingProduct.extraImagesList || [])];
                            updated.splice(idx, 1);
                            setEditingProduct({ ...editingProduct, extraImagesList: updated });
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#68756B]">No additional pictures added yet.</p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E6EBDD] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(editingProduct.id, editingProduct.name)}
                  className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl border border-[#E6EBDD]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl font-bold bg-[#138443] text-white hover:bg-[#0d6131] shadow"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E6EBDD] space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6EBDD]">
              <div>
                <h3 className="font-bold text-base text-[#183D2B]">Add New Beverage Product</h3>
                <p className="text-[11px] text-[#68756B]">Enter details and multiple picture URLs</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juci Cool Lychee Drink"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Flavor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Lychee"
                    value={newProd.flavor}
                    onChange={(e) => setNewProd({ ...newProd, flavor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Category</label>
                  <select
                    value={newProd.categoryId}
                    onChange={(e) => setNewProd({ ...newProd, categoryId: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] bg-white"
                  >
                    <option value={1}>Fruit Drinks</option>
                    <option value={2}>Mango Drinks</option>
                    <option value={3}>Flavored Candy</option>
                    <option value={4}>Fruit Jelly</option>
                    <option value={5}>Natural Mineral Water</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Pack Size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 250 ml Bottle"
                    value={newProd.packSize}
                    onChange={(e) => setNewProd({ ...newProd, packSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Packaging Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PET Bottle"
                    value={newProd.packagingType}
                    onChange={(e) => setNewProd({ ...newProd, packagingType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={newProd.retailPrice}
                    onChange={(e) => setNewProd({ ...newProd, retailPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD] font-bold text-[#183D2B]"
                  />
                  <span className="text-[10px] text-[#68756B]">Normal Customer</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Dealer Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    required
                    value={newProd.wholesalePrice}
                    onChange={(e) => setNewProd({ ...newProd, wholesalePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-bold text-[#138443] bg-emerald-50/50"
                  />
                  <span className="text-[10px] text-emerald-700 font-medium">Dealer Bulk</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProd.stockQuantity}
                    onChange={(e) => setNewProd({ ...newProd, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#183D2B] mb-1">Wholesale MOQ</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProd.minWholesaleQty}
                    onChange={(e) => setNewProd({ ...newProd, minWholesaleQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Fresh fruit beverage details..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                />
              </div>

              {/* Primary Image URL */}
              <div>
                <label className="block font-semibold text-[#183D2B] mb-1">Primary Picture URL</label>
                <input
                  type="text"
                  required
                  placeholder="/images/products/mango-bottle.png"
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBDD]"
                />
              </div>

              {/* Multiple Pictures / Extra Images Section */}
              <div className="p-3 bg-[#F8FAF5] rounded-2xl border border-[#E6EBDD] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-[#183D2B] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#138443]" />
                      <span>Multiple Pictures Choice ({newProd.extraImages.length})</span>
                    </label>
                    <p className="text-[10px] text-[#68756B]">Add gallery pictures for customers to browse</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter picture URL to add:');
                      if (url && url.trim()) {
                        setNewProd({
                          ...newProd,
                          extraImages: [...newProd.extraImages, url.trim()]
                        });
                      }
                    }}
                    className="px-2.5 py-1 bg-white border border-[#138443] text-[#138443] hover:bg-[#138443] hover:text-white rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3 h-3" /> Add Picture
                  </button>
                </div>

                {/* Preset image suggestions for quick adding */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-[#68756B] self-center">Presets:</span>
                  {[
                    '/images/products/shot-mango-bottle.png',
                    '/images/products/guava-pack.png',
                    '/images/products/apple-drink.png',
                    '/images/products/mango-pouch.png'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!newProd.extraImages.includes(preset)) {
                          setNewProd({ ...newProd, extraImages: [...newProd.extraImages, preset] });
                        }
                      }}
                      className="px-2 py-0.5 bg-white border border-[#E6EBDD] text-[10px] text-[#183D2B] rounded-md hover:border-[#138443]"
                    >
                      + {preset.split('/').pop()}
                    </button>
                  ))}
                </div>

                {/* List of currently added extra images */}
                {newProd.extraImages.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                    {newProd.extraImages.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E6EBDD]">
                        <img src={img} alt="Preview" className="w-8 h-8 object-contain rounded bg-slate-50 p-0.5" />
                        <span className="flex-1 truncate text-[11px] text-[#68756B]">{img}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...newProd.extraImages];
                            updated.splice(idx, 1);
                            setNewProd({ ...newProd, extraImages: updated });
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E6EBDD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E6EBDD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl font-bold bg-[#138443] text-white hover:bg-[#0d6131] shadow"
                >
                  {isSaving ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
