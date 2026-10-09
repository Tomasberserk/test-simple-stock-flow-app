import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Eye, User, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { saleRepository } from '../../infrastructure/providers.ts';
import { Sale } from '../../domain/model/Sale.ts';

export const SalesHistoryView: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const loadSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await saleRepository.listSales(currentPage, 15);
      setSales(res.items);
      setTotalPages(res.totalPages);
      setTotalSales(res.total);
    } catch {
      // error handled gracefully
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Historial de Ventas</h1>
        <p className="text-sm text-slate-500 mt-1">
          {totalSales} venta{totalSales === 1 ? '' : 's'} registrada{totalSales === 1 ? '' : 's'} (Inmutables según RN-07)
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Cargando historial de ventas...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingCart className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-300" />
            <p className="text-base font-semibold text-slate-700">No hay ventas registradas aún</p>
            <p className="text-xs text-slate-400 mt-1">Las ventas confirmadas en el carrito aparecerán aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Identificador</th>
                  <th className="py-3.5 px-6">Fecha / Hora</th>
                  <th className="py-3.5 px-6">Vendedor</th>
                  <th className="py-3.5 px-6 text-center">Líneas</th>
                  <th className="py-3.5 px-6 text-right">Total Calculado</th>
                  <th className="py-3.5 px-6 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">
                      {sale.id.slice(0, 8)}...
                    </td>
                    <td className="py-4 px-6 text-slate-800">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{formatDate(sale.soldAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{sale.soldBy}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                        {sale.items.length} {sale.items.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      {sale.total.formatted()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detalle</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Detalle de Venta</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {selectedSale.id}</p>
              </div>
              <button
                onClick={() => setSelectedSale(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block">Fecha de Registro:</span>
                <span className="font-semibold text-slate-700">{formatDate(selectedSale.soldAt)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Vendedor:</span>
                <span className="font-semibold text-slate-700">{selectedSale.soldBy}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 my-4 max-h-60 overflow-y-auto pr-1">
              {selectedSale.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-slate-800">{item.productName}</h5>
                    <span className="text-[11px] text-slate-400">
                      {item.categoryName} · {item.unitPrice.formatted()} x {item.quantity} un.
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">{item.subtotal.formatted()}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">Total Venta:</span>
              <span className="text-lg font-bold text-emerald-700">{selectedSale.total.formatted()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
