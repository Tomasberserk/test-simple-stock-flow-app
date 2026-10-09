import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, AlertCircle, ArrowRight } from 'lucide-react';
import { addToCartUseCase, checkoutUseCase } from '../../application/use-cases/index.ts';
import { Cart } from '../../domain/model/Cart.ts';
import { Sale } from '../../domain/model/Sale.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  onCartUpdated: () => void;
  onSaleCompleted: (sale: Sale) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onCartUpdated,
  onSaleCompleted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdateQty = (productId: string, newQty: number) => {
    try {
      setErrorMessage(null);
      addToCartUseCase.updateQuantity(productId, newQty);
      onCartUpdated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  const handleRemove = (productId: string) => {
    setErrorMessage(null);
    addToCartUseCase.remove(productId);
    onCartUpdated();
  };

  const handleClear = () => {
    setErrorMessage(null);
    addToCartUseCase.clear();
    onCartUpdated();
  };

  const handleCheckout = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const sale = await checkoutUseCase.execute();
      onCartUpdated();
      onSaleCompleted(sale);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar la venta';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Carrito de Ventas</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="m-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {cart.isEmpty() ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-600">El carrito está vacío</p>
                <p className="text-xs text-slate-400 mt-1">Seleccione productos del catálogo para agregarlos.</p>
              </div>
            ) : (
              cart.items.map((item) => {
                const subtotal = item.product.price.multiply(item.quantity);
                return (
                  <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.product.price.formatted()} c/u · <span className="text-slate-400">Disp: {item.product.stock}</span>
                      </div>
                      <div className="font-bold text-sm text-slate-900 mt-1">
                        Subtotal: {subtotal.formatted()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                        <button
                          onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Eliminar línea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {!cart.isEmpty() && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Total de Unidades</span>
                <span className="font-semibold text-slate-700">{cart.getTotalUnits()}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                <span>Total a Pagar</span>
                <span className="text-lg text-emerald-700">{cart.getTotal().formatted()}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-3 border border-slate-300 text-slate-600 hover:bg-white rounded-xl text-xs font-semibold transition"
                >
                  Vaciar
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Registrando venta...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar Venta</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
