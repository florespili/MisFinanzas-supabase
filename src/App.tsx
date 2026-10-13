import React, { useState, useEffect } from 'react';
import { PinLockScreen } from './components/PinLockScreen.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { DetailView } from './components/DetailView.tsx';
import { TransactionModal } from './components/TransactionModal.tsx';
import { CategoriesModal } from './components/CategoriesModal.tsx';
import { BudgetModal } from './components/BudgetModal.tsx';
import { DataManagementModal } from './components/DataManagementModal.tsx';
import { SupabaseConfigModal } from './components/SupabaseConfigModal.tsx';
import { ExportHtmlModal } from './components/ExportHtmlModal.tsx';
import { FinanceService } from './services/supabase.ts';
import { Category, Transaction, Budget, TransactionType } from './types/index.ts';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');
  const [detailType, setDetailType] = useState<TransactionType>('expense');

  const today = new Date();
  const [currentDate, setCurrentDate] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState<boolean>(false);
  const [preselectedTxType, setPreselectedTxType] = useState<TransactionType>('expense');
  const [preselectedTxCategory, setPreselectedTxCategory] = useState<string | undefined>(undefined);

  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState<boolean>(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState<boolean>(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState<boolean>(false);
  const [isExportHtmlOpen, setIsExportHtmlOpen] = useState<boolean>(false);

  const finance = FinanceService.getInstance();
  const { isConnected } = finance.getSupabaseConfig();

  // Load data once unlocked or when month changes
  useEffect(() => {
    if (isUnlocked) {
      loadAllData();
    }
  }, [isUnlocked, currentDate.year, currentDate.month]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [cats, txs, buds, allTxs] = await Promise.all([
        finance.getCategories(),
        finance.getTransactions(currentDate.year, currentDate.month),
        finance.getBudgets(),
        finance.getTransactions(),
      ]);
      setCategories(cats);
      setTransactions(txs);
      setBudgets(buds);
      setAllTransactions(allTxs);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate({ year, month });
  };

  const handleNavigateDetail = (type: TransactionType) => {
    setDetailType(type);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleOpenAddTx = (type: TransactionType = 'expense', categoryId?: string) => {
    setPreselectedTxType(type);
    setPreselectedTxCategory(categoryId);
    setIsAddTxOpen(true);
  };

  const handleSaveTransaction = async (txData: Omit<Transaction, 'id'>) => {
    await finance.addTransaction(txData);
    await loadAllData();
  };

  const handleDeleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => String(t.id) !== String(id)));
    setAllTransactions((prev) => prev.filter((t) => String(t.id) !== String(id)));
    await finance.deleteTransaction(id);
    await loadAllData();
  };

  const handleDeleteAllTransactions = async () => {
    setTransactions([]);
    setAllTransactions([]);
    await finance.deleteAllTransactions();
    await loadAllData();
  };

  const handleDeleteMonthTransactions = async () => {
    setTransactions([]);
    await finance.deleteTransactionsByMonth(currentDate.year, currentDate.month);
    await loadAllData();
  };

  const handleResetDemoData = async () => {
    await finance.resetDemoData();
    await loadAllData();
  };

  const handleSaveCategory = async (cat: Category) => {
    await finance.saveCategory(cat);
    await loadAllData();
  };

  const handleDeleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));
    await finance.deleteCategory(id);
    await loadAllData();
  };

  const handleSaveBudget = async (budget: Budget) => {
    await finance.saveBudget(budget);
    await loadAllData();
  };

  const handleDeleteBudget = async (id: string) => {
    setBudgets((prev) => prev.filter((b) => String(b.id) !== String(id)));
    await finance.deleteBudget(id);
    await loadAllData();
  };

  const handleLockApp = () => {
    setIsUnlocked(false);
    setCurrentView('dashboard');
  };

  // If not unlocked, render the security PIN screen
  if (!isUnlocked) {
    return (
      <>
        <PinLockScreen
          onUnlock={() => setIsUnlocked(true)}
          onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        />
        <SupabaseConfigModal
          isOpen={isSupabaseConfigOpen}
          onClose={() => setIsSupabaseConfigOpen(false)}
          onSaved={() => {
            setIsSupabaseConfigOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800">
      {currentView === 'dashboard' ? (
        <DashboardView
          categories={categories}
          transactions={transactions}
          budgets={budgets}
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          onNavigateDetail={handleNavigateDetail}
          onOpenAddTransaction={() => handleOpenAddTx('expense')}
          onOpenCategoriesManager={() => setIsCategoriesOpen(true)}
          onOpenBudgetManager={() => setIsBudgetOpen(true)}
          onOpenDataManagement={() => setIsDataManagementOpen(true)}
          onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
          onOpenExportHtml={() => setIsExportHtmlOpen(true)}
          onLockApp={handleLockApp}
          onDeleteTransaction={handleDeleteTransaction}
          isConnectedToSupabase={isConnected}
        />
      ) : (
        <DetailView
          type={detailType}
          categories={categories}
          transactions={transactions}
          monthName={MONTH_NAMES[currentDate.month]}
          year={currentDate.year}
          onBack={handleBackToDashboard}
          onAddTransaction={handleOpenAddTx}
          onDeleteTransaction={handleDeleteTransaction}
          onManageCategories={() => setIsCategoriesOpen(true)}
        />
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        categories={categories}
        initialType={preselectedTxType}
        initialCategoryId={preselectedTxCategory}
        defaultDate={`${currentDate.year}-${String(currentDate.month + 1).padStart(2, '0')}-${String(
          Math.min(today.getDate(), 28)
        ).padStart(2, '0')}`}
        onSave={handleSaveTransaction}
        onOpenCategoriesManager={() => {
          setIsAddTxOpen(false);
          setIsCategoriesOpen(true);
        }}
      />

      {/* Categories Manager Modal */}
      <CategoriesModal
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        categories={categories}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Budgets Manager Modal */}
      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        categories={categories}
        budgets={budgets}
        onSaveBudget={handleSaveBudget}
        onDeleteBudget={handleDeleteBudget}
      />

      {/* Data Management & Deletion Modal */}
      <DataManagementModal
        isOpen={isDataManagementOpen}
        onClose={() => setIsDataManagementOpen(false)}
        monthName={MONTH_NAMES[currentDate.month]}
        year={currentDate.year}
        totalTransactionsCount={allTransactions.length}
        monthTransactionsCount={transactions.length}
        onDeleteAllTransactions={handleDeleteAllTransactions}
        onDeleteMonthTransactions={handleDeleteMonthTransactions}
        onResetDemoData={handleResetDemoData}
        onOpenSupabaseConfig={() => {
          setIsDataManagementOpen(false);
          setIsSupabaseConfigOpen(true);
        }}
        onOpenExportHtml={() => {
          setIsDataManagementOpen(false);
          setIsExportHtmlOpen(true);
        }}
        isConnectedToSupabase={isConnected}
      />

      {/* Supabase Config Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
        onSaved={async () => {
          setIsSupabaseConfigOpen(false);
          await loadAllData();
        }}
      />

      {/* Export HTML Modal for GitHub Pages */}
      <ExportHtmlModal
        isOpen={isExportHtmlOpen}
        onClose={() => setIsExportHtmlOpen(false)}
      />
    </div>
  );
}
