import React, { useState } from 'react';
import { BarChart3, Calendar, DollarSign, PackageCheck, AlertCircle, TrendingUp } from 'lucide-react';
import { viewSalesReportUseCase } from '../../application/use-cases/index.ts';
import { SalesReport } from '../../domain/model/Report.ts';

export const SalesReportView: React.FC = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const todayString = today.toISOString().split('T')[0];

  const [from, setFrom] = useState<string>(firstDayOfMonth);
  const [to, setTo] = useState<string>(todayString);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFetchReport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await viewSalesReportUseCase.execute(from, to);
      setReport(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al obtener el reporte de ventas';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reporte Consolidado de Ventas</h1>
        <p className="text-sm text-slate-500 mt-1">
          Agregación en motor SQL con valores congelados e inmutables (HU-06 · DP-01 · DP-02)
        </p>
      </div>

      {/* Date Filter Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-8">
        <form onSubmit={handleFetchReport} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha Inicial (Desde)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha Final (Hasta)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" />
                <span>Generar Reporte</span>
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Report Data */}
      {report && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ingresos Totales (Período)
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {report.grandTotal.formatted()}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total de Ventas Confirmadas
                </span>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {report.totalSalesCount} transacciones
                </div>
              </div>
            </div>
          </div>

          {/* Table by Product */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Desglose por Producto</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {report.startDate} al {report.endDate}
              </span>
            </div>

            {report.items.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p className="text-sm font-medium text-slate-600">No hubo ventas en este rango de fechas</p>
                <p className="text-xs text-slate-400 mt-1">Prueba seleccionando un período más amplio.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-6">Producto</th>
                      <th className="py-3.5 px-6">Categoría</th>
                      <th className="py-3.5 px-6 text-center">Unidades Vendidas</th>
                      <th className="py-3.5 px-6 text-right">Ingresos Generados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.items.map((item) => (
                      <tr key={item.productId} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {item.productName}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                            {item.categoryName}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-800">
                          {item.unitsSold}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-emerald-700">
                          {item.revenue.formatted()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
