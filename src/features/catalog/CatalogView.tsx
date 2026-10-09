import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, Edit3, Image as ImageIcon, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, PackageX } from 'lucide-react';
import { browseCatalogUseCase, manageCatalogUseCase, addToCartUseCase } from '../../application/use-cases/index.ts';
import { Product } from '../../domain/model/Product.ts';
import { User } from '../../domain/model/User.ts';
import { CategoryItem } from '../../application/ports/ProductRepository.ts';

interface CatalogViewProps {
  currentUser: User;
  onCartUpdated: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ currentUser, onCartUpdated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal de Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de Subida de Imagen
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await browseCatalogUseCase.getCategories();
      setCategories(cats);
      if (cats.length > 0 && !formCategory) {
        setFormCategory(cats[0].id);
      }
    } catch {
      // ignore
    }
  }, [formCategory]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await browseCatalogUseCase.execute(
        searchQuery || undefined,
        selectedCategory || undefined,
        currentPage,
        12
      );
      setProducts(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar productos';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = (product: Product) => {
    try {
      addToCartUseCase.execute(product, 1);
      onCartUpdated();
      setNotification({ type: 'success', message: `"${product.name}" añadido al carrito` });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo agregar al carrito';
      setNotification({ type: 'error', message: msg });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormStock('');
    if (categories.length > 0) {
      setFormCategory(categories[0].id);
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price.getAmount().toString());
    setFormStock(p.stock.toString());
    setFormCategory(p.categoryId);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const priceNum = parseFloat(formPrice);
      const stockNum = parseInt(formStock, 10);

      if (editingProduct) {
        await manageCatalogUseCase.updateProduct(editingProduct.id, {
          name: formName,
          price: priceNum,
          stock: stockNum,
          categoryId: formCategory,
        });
        setNotification({ type: 'success', message: 'Producto actualizado exitosamente' });
      } else {
        await manageCatalogUseCase.createProduct({
          name: formName,
          price: priceNum,
          stock: stockNum,
          categoryId: formCategory,
        });
        setNotification({ type: 'success', message: 'Producto creado exitosamente' });
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar producto';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!window.confirm(`¿Dar de baja el producto "${p.name}"? (Se preservará su historial)`)) {
      return;
    }
    try {
      await manageCatalogUseCase.deleteProduct(p.id);
      setNotification({ type: 'success', message: `Producto "${p.name}" dado de baja correctamente` });
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al dar de baja el producto';
      setNotification({ type: 'error', message: msg });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageModalProduct || !selectedFile) return;

    setIsUploadingImage(true);
    try {
      await manageCatalogUseCase.uploadImage(imageModalProduct.id, selectedFile);
      setNotification({ type: 'success', message: 'Imagen cargada correctamente' });
      setImageModalProduct(null);
      setSelectedFile(null);
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir imagen';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'General';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Productos</h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalItems} producto{totalItems === 1 ? '' : 's'} disponible{totalItems === 1 ? '' : 's'} en inventario
          </p>
        </div>

        {currentUser.isAdmin() && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-xl shadow-sm transition"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </button>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 border shadow-sm transition ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre de producto..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Category Pills / Select */}
        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">Todas las Categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
              <div className="w-full h-44 bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <PackageX className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No se encontraron productos</h3>
          <p className="text-sm text-slate-500 mt-1">
            Intenta con otro término de búsqueda o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-44 bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                {product.imageKey ? (
                  <img
                    src={`/media/${product.imageKey}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-1">
                    <ImageIcon className="w-10 h-10 stroke-1 text-slate-300" />
                    <span className="text-[11px] text-slate-400 font-medium">Sin imagen</span>
                  </div>
                )}

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] font-medium text-slate-600 shadow-sm">
                  {getCategoryName(product.categoryId)}
                </span>

                {/* Stock Indicator */}
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    product.stock === 0
                      ? 'bg-rose-100 text-rose-700'
                      : product.stock < 5
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {product.stock === 0 ? 'Agotado' : `${product.stock} disp.`}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-lg font-bold text-slate-900 mt-2">
                    {product.price.formatted()}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.isAvailable()}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    {product.isAvailable() ? 'Agregar al Carrito' : 'Sin Existencias'}
                  </button>

                  {currentUser.isAdmin() && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setImageModalProduct(product)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        title="Subir Imagen"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        title="Editar Producto"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Baja Lógica"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 border-t border-slate-200 pt-6">
          <div className="text-sm text-slate-500">
            Página <span className="font-semibold text-slate-800">{currentPage}</span> de{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Precio (COP)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Categoría</label>
                <select
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Subir Imagen */}
      {imageModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Subir Imagen para "{imageModalProduct.name}"
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Seleccione un archivo de imagen en formato JPEG, PNG o WebP.
            </p>

            <form onSubmit={handleUploadImage} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setImageModalProduct(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage || !selectedFile}
                  className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {isUploadingImage ? 'Subiendo...' : 'Cargar Imagen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
