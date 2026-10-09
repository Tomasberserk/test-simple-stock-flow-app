import React from 'react';
import { ShoppingBag, ShoppingCart, BarChart3, Package, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { User } from '../../domain/model/User.ts';

export type ActiveTab = 'catalog' | 'sales' | 'reports';

interface NavbarProps {
  currentUser: User;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg leading-tight block">Simple Stock Flow</span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">Almacén & Ventas</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'catalog'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catálogo</span>
            </button>

            <button
              onClick={() => onSelectTab('sales')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'sales'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ventas</span>
            </button>

            {currentUser.isAdmin() && (
              <button
                onClick={() => onSelectTab('reports')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === 'reports'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Reporte</span>
              </button>
            )}
          </nav>

          {/* Actions & User */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center justify-center"
              title="Abrir Carrito de Compras"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-200">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-800">{currentUser.username}</div>
                  <div className="flex items-center gap-1">
                    {currentUser.isAdmin() ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 font-medium">
                        <Shield className="w-2.5 h-2.5" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 font-medium">
                        <UserIcon className="w-2.5 h-2.5" /> Vendedor
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition ml-1"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
