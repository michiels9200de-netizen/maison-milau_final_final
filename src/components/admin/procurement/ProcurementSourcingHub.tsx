import React, { useState } from 'react';
import {
  Package,
  Building2,
  Truck,
  Layers,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ProcurementProvider, useProcurement } from '../../../context/ProcurementContext';
import { ProcurementDashboardWidgets } from './ProcurementDashboardWidgets';
import { GreenCoffeeMasterTable } from './GreenCoffeeMasterTable';
import { SupplierManagementView } from './SupplierManagementView';
import { PurchasingManagementView } from './PurchasingManagementView';
import { BlendManagementView } from './BlendManagementView';
import { SourcingPlannerView } from './SourcingPlannerView';
import { ProcurementReportsView } from './ProcurementReportsView';
import { GreenCoffeeMasterBean } from '../../../types';

const ProcurementSourcingInner: React.FC = () => {
  const { refresh, isLoading } = useProcurement();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'master_beans' | 'suppliers' | 'purchasing' | 'blends' | 'sourcing_planner' | 'reports'
  >('overview');

  const [filterLowStockInitial, setFilterLowStockInitial] = useState(false);
  const [selectedBeanForPO, setSelectedBeanForPO] = useState<GreenCoffeeMasterBean | null>(null);

  const handleFilterLowStock = () => {
    setFilterLowStockInitial(true);
    setActiveSubTab('master_beans');
  };

  const handleQuickOrderBean = (bean: GreenCoffeeMasterBean) => {
    setSelectedBeanForPO(bean);
    setActiveSubTab('purchasing');
  };

  const navItems = [
    { id: 'overview', label: 'Overzicht & Dashboard', icon: BarChart3 },
    { id: 'master_beans', label: 'Green Coffee Database', icon: Package },
    { id: 'suppliers', label: 'Leveranciers (Suppliers)', icon: Building2 },
    { id: 'purchasing', label: 'Inkooporders (Purchasing)', icon: Truck },
    { id: 'blends', label: 'Blend Management', icon: Layers },
    { id: 'sourcing_planner', label: 'Oogst- & Sourcing Planner', icon: Calendar },
    { id: 'reports', label: 'Rapportages & Kilograms', icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner with Sub-Nav */}
      <div className="bg-[#1C1B19] border border-[#3A3530] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#332F2B] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Specialty Coffee Procurement & Sourcing Platform
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Master Database
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Centraal inkoopsysteem voor Maison Milau: groene bonen, leveranciers, inkooporders, recepturen en oogstplanning.
            </p>
          </div>

          <button
            onClick={() => refresh()}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-[#2D2A26] hover:bg-[#38342F] text-stone-200 border border-[#3A3530] text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>Verversen</span>
          </button>
        </div>

        {/* Sub-Navigation Buttons */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-stone-900 shadow-sm font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-[#2A2723]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-900' : 'text-[#D4AF37]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab View Rendering */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <ProcurementDashboardWidgets
            onSelectTab={(tab) => setActiveSubTab(tab as any)}
            onFilterLowStock={handleFilterLowStock}
          />
          {/* Quick Preview Table of Master Beans */}
          <div className="pt-2">
            <GreenCoffeeMasterTable onQuickOrderBean={handleQuickOrderBean} />
          </div>
        </div>
      )}

      {activeSubTab === 'master_beans' && (
        <GreenCoffeeMasterTable
          showLowStockOnlyInitial={filterLowStockInitial}
          onQuickOrderBean={handleQuickOrderBean}
        />
      )}

      {activeSubTab === 'suppliers' && (
        <SupplierManagementView
          onViewCoffeesForSupplier={(suppName) => {
            setActiveSubTab('master_beans');
          }}
        />
      )}

      {activeSubTab === 'purchasing' && (
        <PurchasingManagementView
          initialBeanForPO={selectedBeanForPO}
          onClearInitialBean={() => setSelectedBeanForPO(null)}
        />
      )}

      {activeSubTab === 'blends' && <BlendManagementView />}

      {activeSubTab === 'sourcing_planner' && <SourcingPlannerView />}

      {activeSubTab === 'reports' && <ProcurementReportsView />}
    </div>
  );
};

export const ProcurementSourcingHub: React.FC = () => {
  return (
    <ProcurementProvider>
      <ProcurementSourcingInner />
    </ProcurementProvider>
  );
};
