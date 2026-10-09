import React, { useState, useEffect, useCallback } from 'react';
import { LoginForm } from './features/auth/LoginForm.tsx';
import { Navbar, ActiveTab } from './features/layout/Navbar.tsx';
import { CatalogView } from './features/catalog/CatalogView.tsx';
import { CartDrawer } from './features/cart/CartDrawer.tsx';
import { SalesHistoryView } from './features/sales/SalesHistoryView.tsx';
import { SalesReportView } from './features/reports/SalesReportView.tsx';
import { loginUseCase, addToCartUseCase } from './application/use-cases/index.ts';
import { User } from './domain/model/User.ts';
import { Cart } from './domain/model/Cart.ts';
import { Sale } from './domain/model/Sale.ts';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [cart, setCart] = useState<Cart>(new Cart([]));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [saleSuccessBanner, setSaleSuccessBanner] = useState<string | null>(null);

  // Cargar sesión inicial y carrito
  useEffect(() => {
    const user = loginUseCase.getCurrentUser();
    if (user && !user.isExpired()) {
      setCurrentUser(user);
    }
    setCart(addToCartUseCase.getCart());
  }, []);

  const refreshCart = useCallback(() => {
    setCart(addToCartUseCase.getCart());
  }, []);

  const handleLogout = () => {
    loginUseCase.logout();
    setCurrentUser(null);
    setActiveTab('catalog');
  };

  const handleSaleCompleted = (sale: Sale) => {
    setSaleSuccessBanner(`¡Venta confirmada exitosamente! Total: ${sale.total.formatted()}`);
    refreshCart();
    setTimeout(() => {
      setSaleSuccessBanner(null);
    }, 5000);
  };

  if (!currentUser) {
    return <LoginForm onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={cart.getTotalUnits()}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout}
      />

      {/* Banner de Venta Exitosa */}
      {saleSuccessBanner && (
        <div className="bg-emerald-600 text-white px-4 py-3 shadow-md flex items-center justify-center gap-2 text-sm font-medium animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{saleSuccessBanner}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <CatalogView currentUser={currentUser} onCartUpdated={refreshCart} />
        )}
        {activeTab === 'sales' && <SalesHistoryView />}
        {activeTab === 'reports' && currentUser.isAdmin() && <SalesReportView />}
      </main>

      {/* Slide-over Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onCartUpdated={refreshCart}
        onSaleCompleted={handleSaleCompleted}
      />
    </div>
  );
};
