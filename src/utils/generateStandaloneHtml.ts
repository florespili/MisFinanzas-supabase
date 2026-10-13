import { FinanceService } from '../services/supabase.ts';

export function getStandaloneHtml(): string {
  const sql = FinanceService.getSqlScript().replace(/`/g, '\\`');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Mis Finanzas - Finanzas Personales</title>
  <meta name="description" content="App de finanzas personales estilo Mujer Financiera con colores pasteles, PIN privado y Supabase.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Supabase JS Client CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            pastel: {
              sage: '#8E9F7C',
              sageBg: '#EBF1E6',
              sageText: '#3B4B2E',
              lilac: '#E06A60',
              lilacBg: '#FDECE8',
              lilacText: '#8B2E2E',
              yellow: '#E5C86F',
              yellowBg: '#FCF6E5',
              yellowText: '#614E15',
              bg: '#FAF8F5',
              cardBorder: '#EDE8DF',
            }
          }
        }
      }
    }
  </script>

  <style>
    body {
      background-color: #FAF8F5;
      font-family: 'Plus Jakarta Sans', sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    .shake {
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  </style>
</head>
<body class="bg-pastel-bg text-slate-800 antialiased selection:bg-purple-200">

  <!-- ================= VISTA DE BLOQUEO CON PIN ================= -->
  <div id="pinView" class="min-h-screen flex flex-col justify-between items-center p-6 sm:p-8 select-none">
    <div class="w-full max-w-sm flex items-center justify-between pt-2">
      <div class="flex items-center gap-2">
        <div id="pinStatusDot" class="w-2.5 h-2.5 rounded-full bg-[#9678B6]"></div>
        <span id="pinStatusText" class="text-xs font-medium text-slate-500">Conectando...</span>
      </div>
      <button onclick="openModal('dbModal')" class="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-pastel-cardBorder px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-50">
        <i data-lucide="database" class="w-3.5 h-3.5 text-[#9678B6]"></i>
        <span>Configurar BD</span>
      </button>
    </div>

    <div class="w-full max-w-sm flex flex-col items-center my-auto">
      <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#F4EDFA] via-[#EFE7F6] to-[#FAF8F5] flex items-center justify-center border border-white shadow-sm mb-6">
        <i id="pinLockIcon" data-lucide="lock" class="w-9 h-9 text-[#9678B6]"></i>
      </div>

      <h1 id="pinTitle" class="text-2xl font-bold text-slate-800 tracking-tight text-center mb-1.5">
        Finanzas Personales
      </h1>
      <p id="pinSubtitle" class="text-xs text-slate-500 text-center max-w-xs mb-8">
        Ingresa tu PIN de 4 dígitos para acceder a tus finanzas.
      </p>

      <!-- Indicadores de PIN -->
      <div id="pinDotsContainer" class="flex items-center justify-center gap-4 mb-6">
        <div class="pin-dot w-4 h-4 rounded-full bg-[#E3DFD7] border border-[#D5D0C6] transition-all"></div>
        <div class="pin-dot w-4 h-4 rounded-full bg-[#E3DFD7] border border-[#D5D0C6] transition-all"></div>
        <div class="pin-dot w-4 h-4 rounded-full bg-[#E3DFD7] border border-[#D5D0C6] transition-all"></div>
        <div class="pin-dot w-4 h-4 rounded-full bg-[#E3DFD7] border border-[#D5D0C6] transition-all"></div>
      </div>

      <div id="pinErrorMsg" class="hidden text-xs text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl mb-4">
        PIN incorrecto
      </div>

      <!-- Teclado Numérico -->
      <div class="w-full grid grid-cols-3 gap-3.5 max-w-[280px]">
        <button onclick="pressPin('1')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">1</button>
        <button onclick="pressPin('2')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">2</button>
        <button onclick="pressPin('3')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">3</button>
        <button onclick="pressPin('4')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">4</button>
        <button onclick="pressPin('5')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">5</button>
        <button onclick="pressPin('6')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">6</button>
        <button onclick="pressPin('7')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">7</button>
        <button onclick="pressPin('8')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">8</button>
        <button onclick="pressPin('9')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">9</button>
        <button onclick="clearPin()" class="h-14 rounded-2xl bg-transparent text-slate-400 text-xs font-semibold hover:text-slate-600">BORRAR</button>
        <button onclick="pressPin('0')" class="h-14 rounded-2xl bg-white border border-pastel-cardBorder text-slate-800 text-xl font-semibold shadow-sm active:bg-slate-100">0</button>
        <button onclick="deletePinDigit()" class="h-14 rounded-2xl bg-transparent text-slate-600 text-base font-semibold">⌫</button>
      </div>
    </div>

    <div class="w-full max-w-sm text-center pt-4 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
      <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#9678B6]"></i>
      <span>Protegido con Supabase y Hash SHA-256</span>
    </div>
  </div>

  <!-- ================= VISTA PRINCIPAL (DASHBOARD) ================= -->
  <div id="mainDashboard" class="hidden min-h-screen pb-28">
    <header class="sticky top-0 z-30 bg-pastel-bg/90 backdrop-blur-md border-b border-pastel-cardBorder px-4 sm:px-6 py-3.5">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F4EDFA] via-[#EFE7F6] to-[#FAF8F5] flex items-center justify-center border border-white shadow-sm">
            <i data-lucide="sparkles" class="w-4 h-4 text-[#9678B6]"></i>
          </div>
          <div>
            <span class="text-sm font-bold tracking-tight text-slate-800">Mis Finanzas</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="lockApp()" class="w-8 h-8 rounded-full bg-white border border-pastel-cardBorder text-slate-600 flex items-center justify-center shadow-sm">
            <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-500"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
      <!-- Selector de Mes -->
      <div class="flex items-center justify-between bg-white rounded-2xl px-4 py-2.5 border border-pastel-cardBorder shadow-sm">
        <button onclick="prevMonth()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900">
          <i data-lucide="chevron-left" class="w-5 h-5"></i>
        </button>
        <span id="currentMonthLabel" class="text-sm font-bold text-slate-800 tracking-tight"></span>
        <button onclick="nextMonth()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900">
          <i data-lucide="chevron-right" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Balance Acumulado Card -->
      <div class="bg-gradient-to-br from-white to-pastel-bg rounded-3xl p-6 border border-pastel-cardBorder shadow-sm relative overflow-hidden">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Balance Acumulado</span>
        <p id="balanceAmount" class="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight my-1 tabular-nums">$ 0.00</p>
        <p class="text-xs text-slate-400">Saldo disponible del mes (Ingresos - Gastos)</p>
      </div>

      <!-- Las 3 Tarjetas de Resumen (Ingresos, Gastos, Ahorros) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Resumen Financiero</h2>
          <span class="text-xs text-slate-400">Toca para ver detalle</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Ingresos -->
          <div onclick="showDetail('income')" class="bg-pastel-sageBg rounded-2xl p-4 border border-[#D7E3D0] shadow-sm cursor-pointer hover:opacity-95 transition-all active:scale-98">
            <p class="text-xs font-semibold uppercase text-pastel-sageText/70 mb-0.5">Ingresos</p>
            <p id="totalIncomeText" class="text-xl font-bold text-pastel-sageText tabular-nums">$ 0.00</p>
            <p id="incomeCountText" class="text-[11px] text-pastel-sageText/60 mt-1">0 movimientos</p>
          </div>

          <!-- Gastos -->
          <div onclick="showDetail('expense')" class="bg-pastel-lilacBg rounded-2xl p-4 border border-[#F8D2CA] shadow-sm cursor-pointer hover:opacity-95 transition-all active:scale-98">
            <p class="text-xs font-semibold uppercase text-pastel-lilacText/70 mb-0.5">Gastos</p>
            <p id="totalExpenseText" class="text-xl font-bold text-pastel-lilacText tabular-nums">$ 0.00</p>
            <p id="expenseCountText" class="text-[11px] text-pastel-lilacText/60 mt-1">0 movimientos</p>
          </div>

          <!-- Ahorros -->
          <div onclick="showDetail('saving')" class="bg-pastel-yellowBg rounded-2xl p-4 border border-[#F2E5BD] shadow-sm cursor-pointer hover:opacity-95 transition-all active:scale-98">
            <p class="text-xs font-semibold uppercase text-pastel-yellowText/70 mb-0.5">Ahorros</p>
            <p id="totalSavingText" class="text-xl font-bold text-pastel-yellowText tabular-nums">$ 0.00</p>
            <p id="savingCountText" class="text-[11px] text-pastel-yellowText/60 mt-1">0 aportes</p>
          </div>
        </div>
      </div>

      <!-- Mis Presupuestos -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mis Presupuestos</h2>
          <button onclick="openModal('budgetModal')" class="text-xs font-semibold text-pastel-sage hover:underline flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Agregar
          </button>
        </div>
        <div id="budgetsList" class="space-y-2.5"></div>
      </div>

      <!-- Últimos Movimientos -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Movimientos del Mes</h2>
          <button onclick="openModal('categoriesModal')" class="text-xs text-slate-500 hover:text-slate-800">
            Categorías
          </button>
        </div>
        <div id="recentTransactionsList" class="space-y-2"></div>
      </div>
    </main>

    <!-- Botón Flotante '+' -->
    <div class="fixed bottom-6 right-6 z-40">
      <button onclick="openAddTransactionModal()" class="w-14 h-14 rounded-full bg-[#9678B6] text-white shadow-lg flex items-center justify-center hover:bg-[#8666A6] active:scale-95 transition-transform ring-4 ring-pastel-bg">
        <i data-lucide="plus" class="w-7 h-7"></i>
      </button>
    </div>
  </div>

  <!-- ================= VISTA DE DETALLE (INGRESOS / GASTOS / AHORROS) ================= -->
  <div id="detailView" class="hidden min-h-screen pb-28">
    <div id="detailHeaderBg" class="pt-4 pb-6 px-4 sm:px-6 border-b border-pastel-cardBorder">
      <div class="max-w-xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <button onclick="closeDetail()" class="w-10 h-10 rounded-full bg-white/80 border border-pastel-cardBorder shadow-sm flex items-center justify-center text-slate-700">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <span id="detailMonthLabel" class="text-sm font-semibold text-slate-700"></span>
          <button onclick="openModal('categoriesModal')" class="text-xs font-medium text-slate-600 bg-white/80 border border-pastel-cardBorder px-3 py-1.5 rounded-full shadow-sm">
            Categorías
          </button>
        </div>

        <div id="detailCard" class="rounded-3xl p-6 border border-white/80 shadow-sm text-center">
          <p id="detailTypeLabel" class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total del Mes
          </p>
          <p id="detailTotalAmount" class="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">$ 0.00</p>
          <p id="detailCountLabel" class="text-xs text-slate-500 mt-1">0 movimientos registrados</p>
        </div>
      </div>
    </div>

    <div class="max-w-xl mx-auto px-4 sm:px-6 pt-6">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Desglose por Categorías
      </h2>
      <div id="detailCategoriesList" class="space-y-3"></div>
    </div>

    <div class="fixed bottom-6 right-6 z-30">
      <button onclick="openAddTransactionModal(currentDetailType)" id="detailFab" class="w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center active:scale-95 transition-all">
        <i data-lucide="plus" class="w-7 h-7"></i>
      </button>
    </div>
  </div>

  <!-- ================= MODAL: REGISTRAR MOVIMIENTO ================= -->
  <div id="txModal" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
    <div class="w-full max-w-lg bg-pastel-bg rounded-t-3xl sm:rounded-3xl border border-pastel-cardBorder shadow-xl max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-pastel-cardBorder bg-white">
        <h2 class="text-base font-bold text-slate-800">Registrar Movimiento</h2>
        <button onclick="closeModal('txModal')" class="text-slate-400 hover:text-slate-700">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form onsubmit="saveTransactionForm(event)" class="p-6 space-y-4 overflow-y-auto flex-1">
        <!-- Tipo -->
        <div class="grid grid-cols-3 gap-1.5 p-1 bg-[#F0EDE6] rounded-2xl">
          <button type="button" onclick="setTxType('income')" id="btnTxTypeIncome" class="py-2 text-xs font-semibold rounded-xl transition-all">🌱 Ingreso</button>
          <button type="button" onclick="setTxType('expense')" id="btnTxTypeExpense" class="py-2 text-xs font-semibold rounded-xl transition-all">🌸 Gasto</button>
          <button type="button" onclick="setTxType('saving')" id="btnTxTypeSaving" class="py-2 text-xs font-semibold rounded-xl transition-all">⭐ Ahorro</button>
        </div>

        <!-- Monto -->
        <div class="bg-white rounded-2xl p-4 border border-pastel-cardBorder">
          <span class="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Monto</span>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-slate-400">$</span>
            <input type="number" step="0.01" id="txAmount" placeholder="0.00" required class="w-full text-3xl font-bold text-slate-800 bg-transparent focus:outline-hidden tabular-nums">
          </div>
        </div>

        <!-- Categoría -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Categoría</label>
            <button type="button" onclick="openModal('categoriesModal')" class="text-xs text-pastel-sage hover:underline">+ Administrar</button>
          </div>
          <div id="txCategoryGrid" class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1"></div>
        </div>

        <!-- Subcategoría -->
        <div id="txSubcatWrapper">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Subcategoría</label>
          <div id="txSubcatPills" class="flex flex-wrap gap-1.5 mb-2"></div>
          <input type="text" id="txSubcatInput" placeholder="O escribe una subcategoría..." class="w-full text-xs p-2.5 rounded-xl bg-white border border-pastel-cardBorder focus:outline-hidden">
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Fecha</label>
          <input type="date" id="txDate" required class="w-full text-xs p-3 rounded-xl bg-white border border-pastel-cardBorder focus:outline-hidden text-slate-700 font-medium">
        </div>

        <!-- Nota -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Nota (Opcional)</label>
          <input type="text" id="txNote" placeholder="Ej: Compra en supermercado" class="w-full text-xs p-3 rounded-xl bg-white border border-pastel-cardBorder focus:outline-hidden text-slate-700">
        </div>

        <button type="submit" class="w-full h-12 rounded-2xl bg-[#9678B6] text-white text-sm font-bold shadow-sm hover:bg-[#8666A6] active:scale-98 transition-all">
          Guardar Movimiento
        </button>
      </form>
    </div>
  </div>

  <!-- ================= MODAL: CATEGORÍAS & SUBCATEGORÍAS ================= -->
  <div id="categoriesModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
    <div class="w-full max-w-lg bg-pastel-bg rounded-3xl border border-pastel-cardBorder shadow-xl max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-pastel-cardBorder bg-white">
        <h2 class="text-base font-bold text-slate-800">Administrar Categorías</h2>
        <button onclick="closeModal('categoriesModal')" class="text-slate-400 hover:text-slate-700">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 space-y-4">
        <!-- Nueva Categoría Form -->
        <form onsubmit="saveCategoryForm(event)" class="bg-white p-4 rounded-2xl border border-pastel-cardBorder space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">Crear / Editar Categoría</h3>
          <div class="grid grid-cols-3 gap-1.5 p-1 bg-[#F0EDE6] rounded-xl">
            <button type="button" onclick="setNewCatType('expense')" id="btnNewCatExpense" class="py-1 text-xs font-semibold rounded-lg">🌸 Gasto</button>
            <button type="button" onclick="setNewCatType('income')" id="btnNewCatIncome" class="py-1 text-xs font-semibold rounded-lg">🌱 Ingreso</button>
            <button type="button" onclick="setNewCatType('saving')" id="btnNewCatSaving" class="py-1 text-xs font-semibold rounded-lg">⭐ Ahorro</button>
          </div>
          <input type="text" id="newCatName" placeholder="Nombre (ej: Mascotas, Alquiler)" required class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pastel-cardBorder focus:outline-hidden">
          
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Emoji del teléfono o imagen</label>
            <div class="flex items-center gap-2">
              <input type="text" id="newCatIcon" value="🥑" placeholder="Toca para usar emoji del cel 📱" class="flex-1 text-sm p-2 rounded-xl bg-slate-50 border border-pastel-cardBorder">
              <input type="file" id="newCatImageFile" accept="image/*" class="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-pastel-sageBg file:text-pastel-sageText">
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Subcategorías (separadas por coma)</label>
            <input type="text" id="newCatSubs" placeholder="Ej: Super, Farmacia, Café" class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pastel-cardBorder">
          </div>

          <button type="submit" class="w-full py-2.5 rounded-xl bg-pastel-sage text-white text-xs font-bold">
            Guardar Categoría
          </button>
        </form>

        <!-- Lista de Categorías -->
        <div id="categoriesListManager" class="space-y-2"></div>
      </div>
    </div>
  </div>

  <!-- ================= MODAL: PRESUPUESTOS ================= -->
  <div id="budgetModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
    <div class="w-full max-w-md bg-pastel-bg rounded-3xl border border-pastel-cardBorder shadow-xl max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-pastel-cardBorder bg-white">
        <h2 class="text-base font-bold text-slate-800">Mis Presupuestos</h2>
        <button onclick="closeModal('budgetModal')" class="text-slate-400 hover:text-slate-700">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 space-y-4">
        <form onsubmit="saveBudgetForm(event)" class="bg-white p-4 rounded-2xl border border-pastel-cardBorder space-y-3">
          <label class="block text-xs font-semibold text-slate-600">Categoría de Gasto</label>
          <select id="budgetCategorySelect" class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pastel-cardBorder"></select>

          <label class="block text-xs font-semibold text-slate-600">Límite Mensual ($)</label>
          <input type="number" id="budgetLimitInput" placeholder="Ej: 500" required class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pastel-cardBorder font-bold">

          <button type="submit" class="w-full py-2.5 rounded-xl bg-pastel-sage text-white text-xs font-bold">
            Asignar Presupuesto
          </button>
        </form>

        <div id="activeBudgetsList" class="space-y-2"></div>
      </div>
    </div>
  </div>

  <!-- ================= MODAL: CONFIGURAR SUPABASE & SQL ================= -->
  <div id="dbModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
    <div class="w-full max-w-xl bg-pastel-bg rounded-3xl border border-pastel-cardBorder shadow-xl max-h-[92vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-pastel-cardBorder bg-white">
        <div class="flex items-center gap-2">
          <i data-lucide="database" class="w-5 h-5 text-pastel-sage"></i>
          <h2 class="text-base font-bold text-slate-800">Configuración Supabase</h2>
        </div>
        <button onclick="closeModal('dbModal')" class="text-slate-400 hover:text-slate-700">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 space-y-4">
        <form onsubmit="saveSupabaseForm(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">SUPABASE_URL</label>
            <input type="url" id="sbUrl" placeholder="https://xyz.supabase.co" class="w-full text-xs p-3 rounded-xl bg-white border border-pastel-cardBorder font-mono">
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">SUPABASE_ANON_KEY</label>
            <input type="password" id="sbKey" placeholder="eyJhbGciOiJIUz..." class="w-full text-xs p-3 rounded-xl bg-white border border-pastel-cardBorder font-mono">
          </div>
          <div class="flex gap-2 pt-2">
            <button type="submit" class="flex-1 py-3 rounded-2xl bg-pastel-sage text-white text-xs font-bold shadow-sm">
              Guardar y Conectar
            </button>
            <button type="button" onclick="useDemoMode()" class="px-4 py-3 rounded-2xl bg-white border border-pastel-cardBorder text-slate-600 text-xs font-semibold">
              Modo Local
            </button>
          </div>
        </form>

        <div class="border-t border-pastel-cardBorder pt-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700">Script SQL para Supabase</span>
            <button onclick="copySqlScript()" id="btnCopySql" class="text-xs px-3 py-1 bg-pastel-sage text-white rounded-lg font-semibold">
              Copiar SQL
            </button>
          </div>
          <div class="bg-slate-900 text-slate-200 text-[11px] font-mono p-3 rounded-xl max-h-48 overflow-y-auto">
            <pre id="sqlPre"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    const SQL_INIT_SCRIPT = \`${sql}\`;
    document.getElementById('sqlPre').textContent = SQL_INIT_SCRIPT;

    // Default Categories
    const DEFAULT_CATEGORIES = [
      { id: 'cat-exp-1', type: 'expense', name: 'Alimentación & Super', icon_or_image_url: '🥑', subcategories: ['Supermercado', 'Verdulería', 'Café', 'Delivery'] },
      { id: 'cat-exp-2', type: 'expense', name: 'Hogar & Servicios', icon_or_image_url: '🏡', subcategories: ['Alquiler', 'Luz & Gas', 'Internet', 'Limpieza'] },
      { id: 'cat-exp-3', type: 'expense', name: 'Transporte', icon_or_image_url: '🚗', subcategories: ['Combustible', 'Transporte público', 'Seguro'] },
      { id: 'cat-exp-4', type: 'expense', name: 'Salud & Bienestar', icon_or_image_url: '🧘‍♀️', subcategories: ['Farmacia', 'Gimnasio', 'Cuidado personal'] },
      { id: 'cat-exp-5', type: 'expense', name: 'Educación & Cursos', icon_or_image_url: '📚', subcategories: ['Cursos online', 'Libros'] },
      { id: 'cat-exp-6', type: 'expense', name: 'Ocio & Salidas', icon_or_image_url: '✨', subcategories: ['Cena con amigas', 'Cine', 'Paseos'] },
      { id: 'cat-inc-1', type: 'income', name: 'Sueldo Principal', icon_or_image_url: '💼', subcategories: ['Salario mensual', 'Bono'] },
      { id: 'cat-inc-2', type: 'income', name: 'Emprendimiento', icon_or_image_url: '🌱', subcategories: ['Clientes', 'Ventas'] },
      { id: 'cat-inc-3', type: 'income', name: 'Inversiones', icon_or_image_url: '📈', subcategories: ['Rentas', 'Plazo fijo'] },
      { id: 'cat-sav-1', type: 'saving', name: 'Fondo de Emergencia', icon_or_image_url: '🛡️', subcategories: ['Reserva 3 meses'] },
      { id: 'cat-sav-2', type: 'saving', name: 'Vacaciones & Viajes', icon_or_image_url: '✈️', subcategories: ['Pasajes', 'Hotel'] },
      { id: 'cat-sav-3', type: 'saving', name: 'Metas a Largo Plazo', icon_or_image_url: '⭐', subcategories: ['Casa propia'] }
    ];

    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // App State
    let supabaseClient = null;
    let categories = [];
    let transactions = [];
    let budgets = [];
    let currentDate = { year: new Date().getFullYear(), month: new Date().getMonth() };
    let enteredPin = '';
    let isSetupMode = false;
    let setupStep = 1;
    let firstEnteredPin = '';
    let currentDetailType = 'expense';
    let currentTxType = 'expense';
    let selectedCatIdForTx = '';
    let selectedSubcatForTx = '';
    let newCatType = 'expense';
    let newCatBase64 = '';

    // SHA-256 Hash
    async function sha256(text) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Initialize Supabase
    function initSupabase() {
      const stored = localStorage.getItem('finanzas_pastel_sb_cfg');
      if (stored) {
        try {
          const { url, key } = JSON.parse(stored);
          if (url && key && window.supabase) {
            supabaseClient = window.supabase.createClient(url, key);
            document.getElementById('pinStatusText').textContent = 'Supabase Conectado';
            document.getElementById('headerDbLabel').textContent = 'Supabase';
            return;
          }
        } catch(e) {}
      }
      supabaseClient = null;
      document.getElementById('pinStatusText').textContent = 'Modo Local';
      document.getElementById('headerDbLabel').textContent = 'Modo Local';
    }

    // Check PIN status
    async function checkPinStatus() {
      initSupabase();
      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('app_config').select('pin_hash').limit(1);
          if (!error && data && data.length > 0 && data[0].pin_hash) {
            isSetupMode = false;
            document.getElementById('pinTitle').textContent = 'Finanzas Personales';
            document.getElementById('pinSubtitle').textContent = 'Ingresa tu PIN de 4 dígitos para acceder.';
            return;
          }
        } catch(e) {}
      }
      const localPin = localStorage.getItem('finanzas_local_pin');
      if (localPin) {
        isSetupMode = false;
        document.getElementById('pinTitle').textContent = 'Finanzas Personales';
        document.getElementById('pinSubtitle').textContent = 'Ingresa tu PIN de 4 dígitos para acceder.';
      } else {
        isSetupMode = true;
        setupStep = 1;
        document.getElementById('pinTitle').textContent = 'Crea tu PIN Privado';
        document.getElementById('pinSubtitle').textContent = 'Define un PIN de 4 dígitos para proteger tu cuenta.';
      }
    }

    // Keypad PIN
    function pressPin(digit) {
      if (enteredPin.length < 4) {
        enteredPin += digit;
        updatePinDots();
        if (enteredPin.length === 4) {
          setTimeout(handlePinSubmit, 150);
        }
      }
    }

    function clearPin() {
      enteredPin = '';
      updatePinDots();
      document.getElementById('pinErrorMsg').classList.add('hidden');
    }

    function deletePinDigit() {
      enteredPin = enteredPin.slice(0, -1);
      updatePinDots();
      document.getElementById('pinErrorMsg').classList.add('hidden');
    }

    function updatePinDots() {
      const dots = document.querySelectorAll('.pin-dot');
      dots.forEach((dot, index) => {
        if (enteredPin.length > index) {
          dot.className = 'pin-dot w-4 h-4 rounded-full bg-[#9678B6] scale-110 shadow-xs transition-all';
        } else {
          dot.className = 'pin-dot w-4 h-4 rounded-full bg-[#E3DFD7] border border-[#D5D0C6] transition-all';
        }
      });
    }

    async function handlePinSubmit() {
      const hash = await sha256(enteredPin);

      if (isSetupMode) {
        if (setupStep === 1) {
          firstEnteredPin = enteredPin;
          enteredPin = '';
          setupStep = 2;
          document.getElementById('pinTitle').textContent = 'Confirma tu PIN';
          document.getElementById('pinSubtitle').textContent = 'Ingresa nuevamente los 4 dígitos.';
          updatePinDots();
        } else {
          if (enteredPin !== firstEnteredPin) {
            shakePin('Los PINs no coinciden');
            enteredPin = '';
            setupStep = 1;
            document.getElementById('pinTitle').textContent = 'Crea tu PIN Privado';
            updatePinDots();
            return;
          }
          // Guardar PIN
          if (supabaseClient) {
            const { error } = await supabaseClient.from('app_config').insert([{ pin_hash: hash }]);
            if (error) {
              shakePin(error.message);
              return;
            }
          } else {
            localStorage.setItem('finanzas_local_pin', hash);
          }
          unlockApp();
        }
      } else {
        // Verificar
        let valid = false;
        if (supabaseClient) {
          try {
            const { data } = await supabaseClient.from('app_config').select('pin_hash').limit(1);
            if (data && data.length > 0) {
              valid = data[0].pin_hash === hash;
            }
          } catch(e) {}
        }
        if (!valid) {
          const localPin = localStorage.getItem('finanzas_local_pin');
          valid = localPin === hash;
        }

        if (valid) {
          unlockApp();
        } else {
          shakePin('PIN incorrecto');
        }
      }
    }

    function shakePin(msg) {
      const c = document.getElementById('pinDotsContainer');
      c.classList.add('shake');
      setTimeout(() => c.classList.remove('shake'), 450);
      const err = document.getElementById('pinErrorMsg');
      err.textContent = msg;
      err.classList.remove('hidden');
      enteredPin = '';
      updatePinDots();
    }

    function unlockApp() {
      document.getElementById('pinView').classList.add('hidden');
      document.getElementById('mainDashboard').classList.remove('hidden');
      loadData();
    }

    function lockApp() {
      enteredPin = '';
      updatePinDots();
      document.getElementById('mainDashboard').classList.add('hidden');
      document.getElementById('detailView').classList.add('hidden');
      document.getElementById('pinView').classList.remove('hidden');
    }

    // Cargar Datos
    async function loadData() {
      // Categorías
      if (supabaseClient) {
        try {
          const { data } = await supabaseClient.from('categories').select('*');
          if (data && data.length > 0) {
            categories = data;
          } else {
            categories = DEFAULT_CATEGORIES;
          }
        } catch(e) {
          categories = DEFAULT_CATEGORIES;
        }
      } else {
        const stored = localStorage.getItem('finanzas_cats');
        categories = stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
      }

      // Transacciones
      if (supabaseClient) {
        try {
          const { data } = await supabaseClient.from('transactions').select('*').order('date', { ascending: false });
          transactions = data || [];
        } catch(e) {
          transactions = [];
        }
      } else {
        const stored = localStorage.getItem('finanzas_txs');
        transactions = stored ? JSON.parse(stored) : [
          { id: 't1', type: 'income', category_id: 'cat-inc-1', subcategory: 'Salario', amount: 2500, date: \`\${currentDate.year}-\${String(currentDate.month+1).padStart(2,'0')}-01\`, note: 'Sueldo mensual' },
          { id: 't2', type: 'expense', category_id: 'cat-exp-1', subcategory: 'Supermercado', amount: 320, date: \`\${currentDate.year}-\${String(currentDate.month+1).padStart(2,'0')}-04\`, note: 'Alimentos' },
          { id: 't3', type: 'expense', category_id: 'cat-exp-2', subcategory: 'Alquiler', amount: 650, date: \`\${currentDate.year}-\${String(currentDate.month+1).padStart(2,'0')}-05\`, note: 'Alquiler' },
          { id: 't4', type: 'saving', category_id: 'cat-sav-1', subcategory: 'Reserva 3 meses', amount: 300, date: \`\${currentDate.year}-\${String(currentDate.month+1).padStart(2,'0')}-08\`, note: 'Ahorro para tranquilidad' }
        ];
      }

      // Presupuestos
      if (supabaseClient) {
        try {
          const { data } = await supabaseClient.from('budgets').select('*');
          budgets = data || [];
        } catch(e) {
          budgets = [];
        }
      } else {
        const stored = localStorage.getItem('finanzas_budgets');
        budgets = stored ? JSON.parse(stored) : [
          { id: 'b1', category_id: 'cat-exp-1', monthly_limit: 500 }
        ];
      }

      renderDashboard();
    }

    function renderDashboard() {
      // Label Mes
      document.getElementById('currentMonthLabel').textContent = \`\${MONTHS[currentDate.month]} \${currentDate.year}\`;

      // Filtrar transacciones del mes
      const prefix = \`\${currentDate.year}-\${String(currentDate.month+1).padStart(2,'0')}\`;
      const currentMonthTxs = transactions.filter(t => t.date && t.date.startsWith(prefix));

      const incs = currentMonthTxs.filter(t => t.type === 'income');
      const exps = currentMonthTxs.filter(t => t.type === 'expense');
      const savs = currentMonthTxs.filter(t => t.type === 'saving');

      const sumInc = incs.reduce((a, t) => a + Number(t.amount), 0);
      const sumExp = exps.reduce((a, t) => a + Number(t.amount), 0);
      const sumSav = savs.reduce((a, t) => a + Number(t.amount), 0);
      const balance = sumInc - sumExp;

      document.getElementById('balanceAmount').textContent = \`$ \${balance.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}\`;
      document.getElementById('totalIncomeText').textContent = \`$ \${sumInc.toLocaleString('es-AR', {minimumFractionDigits: 2})}\`;
      document.getElementById('incomeCountText').textContent = \`\${incs.length} movimiento\${incs.length !== 1 ? 's' : ''}\`;

      document.getElementById('totalExpenseText').textContent = \`$ \${sumExp.toLocaleString('es-AR', {minimumFractionDigits: 2})}\`;
      document.getElementById('expenseCountText').textContent = \`\${exps.length} movimiento\${exps.length !== 1 ? 's' : ''}\`;

      document.getElementById('totalSavingText').textContent = \`$ \${sumSav.toLocaleString('es-AR', {minimumFractionDigits: 2})}\`;
      document.getElementById('savingCountText').textContent = \`\${savs.length} aporte\${savs.length !== 1 ? 's' : ''}\`;

      // Render Presupuestos
      const budgetContainer = document.getElementById('budgetsList');
      budgetContainer.innerHTML = '';
      if (budgets.length === 0) {
        budgetContainer.innerHTML = '<p class="text-xs text-slate-400 italic bg-white p-4 rounded-2xl border border-pastel-cardBorder text-center">Sin presupuestos asignados aún.</p>';
      } else {
        budgets.forEach(b => {
          const cat = categories.find(c => c.id === b.category_id);
          const spent = exps.filter(t => t.category_id === b.category_id).reduce((a, t) => a + Number(t.amount), 0);
          const pct = Math.min(100, (spent / b.monthly_limit) * 100);
          const isOver = spent > b.monthly_limit;

          budgetContainer.innerHTML += \`
            <div class="bg-white rounded-2xl p-4 border border-pastel-cardBorder shadow-sm space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-lg">\${cat ? cat.icon_or_image_url : '📁'}</span>
                  <span class="text-xs font-bold text-slate-800">\${cat ? cat.name : 'Categoría'}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-slate-800 tabular-nums">$ \${spent.toLocaleString('es-AR')} de $ \${Number(b.monthly_limit).toLocaleString('es-AR')}</span>
                  <span class="text-[10px] block \${isOver ? 'text-rose-600 font-semibold' : 'text-slate-400'}">\${pct.toFixed(0)}% utilizado</span>
                </div>
              </div>
              <div class="w-full bg-[#F3EFEA] h-2 rounded-full overflow-hidden">
                <div class="h-full rounded-full \${isOver ? 'bg-rose-400' : pct > 80 ? 'bg-pastel-yellow' : 'bg-pastel-sage'}" style="width: \${pct}%"></div>
              </div>
            </div>
          \`;
        });
      }

      // Render Movimientos Recientes
      const txContainer = document.getElementById('recentTransactionsList');
      txContainer.innerHTML = '';
      if (currentMonthTxs.length === 0) {
        txContainer.innerHTML = '<p class="text-xs text-slate-400 italic bg-white p-5 rounded-2xl border border-pastel-cardBorder text-center">Sin movimientos este mes.</p>';
      } else {
        currentMonthTxs.slice(0, 10).forEach(tx => {
          const cat = categories.find(c => c.id === tx.category_id);
          const isInc = tx.type === 'income';
          const isSav = tx.type === 'saving';
          const parts = tx.date.split('-');
          const ddmmaa = parts.length === 3 ? \`\${parts[2]}/\${parts[1]}/\${parts[0].slice(2)}\` : tx.date;

          txContainer.innerHTML += \`
            <div class="bg-white rounded-2xl p-3.5 border border-pastel-cardBorder flex items-center justify-between gap-3 shadow-sm">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-pastel-bg border border-pastel-cardBorder flex items-center justify-center text-lg shrink-0">
                  \${cat ? cat.icon_or_image_url : '📁'}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <p class="text-xs font-bold text-slate-800 truncate">\${cat ? cat.name : 'Movimiento'}</p>
                    \${tx.subcategory ? \`<span class="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">\${tx.subcategory}</span>\` : ''}
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5">\${ddmmaa} \${tx.note ? '· ' + tx.note : ''}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-sm font-bold tabular-nums \${isInc ? 'text-pastel-sageText' : isSav ? 'text-pastel-yellowText' : 'text-pastel-lilacText'}">
                  \${isInc ? '+ ' : '- '}$ \${Number(tx.amount).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                </span>
                <button onclick="deleteTransaction('\${tx.id}')" class="text-slate-300 hover:text-rose-600 p-1">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          \`;
        });
      }

      lucide.createIcons();
    }

    // Mes anterior / siguiente
    function prevMonth() {
      if (currentDate.month === 0) {
        currentDate.year--;
        currentDate.month = 11;
      } else {
        currentDate.month--;
      }
      renderDashboard();
    }

    function nextMonth() {
      if (currentDate.month === 11) {
        currentDate.year++;
        currentDate.month = 0;
      } else {
        currentDate.month++;
      }
      renderDashboard();
    }

    // Pantalla de Detalle (Ingresos / Gastos / Ahorros)
    function showDetail(type) {
      currentDetailType = type;
      document.getElementById('mainDashboard').classList.add('hidden');
      document.getElementById('detailView').classList.remove('hidden');

      const prefix = \`\${currentDate.year}-\${String(currentDate.month+1).padStart(2,'0')}\`;
      const currentMonthTxs = transactions.filter(t => t.date && t.date.startsWith(prefix) && t.type === type);
      const total = currentMonthTxs.reduce((a, t) => a + Number(t.amount), 0);

      const headerBg = document.getElementById('detailHeaderBg');
      const detailCard = document.getElementById('detailCard');
      const fab = document.getElementById('detailFab');
      const typeLabel = document.getElementById('detailTypeLabel');

      document.getElementById('detailMonthLabel').textContent = \`\${MONTHS[currentDate.month]} \${currentDate.year}\`;
      document.getElementById('detailTotalAmount').textContent = \`$ \${total.toLocaleString('es-AR', {minimumFractionDigits: 2})}\`;
      document.getElementById('detailCountLabel').textContent = \`\${currentMonthTxs.length} movimiento\${currentMonthTxs.length !== 1 ? 's' : ''} registrado\${currentMonthTxs.length !== 1 ? 's' : ''}\`;

      if (type === 'income') {
        typeLabel.textContent = 'Total Ingresos del Mes';
        headerBg.className = 'bg-gradient-to-b from-pastel-sageBg via-[#E2EAD9] to-pastel-bg pt-4 pb-6 px-4 sm:px-6 border-b border-pastel-cardBorder';
        detailCard.className = 'bg-pastel-sageBg rounded-3xl p-6 border border-white/80 shadow-sm text-center text-pastel-sageText';
        fab.className = 'w-14 h-14 rounded-full bg-pastel-sage text-white shadow-lg flex items-center justify-center';
      } else if (type === 'expense') {
        typeLabel.textContent = 'Total Gastos del Mes';
        headerBg.className = 'bg-gradient-to-b from-pastel-lilacBg via-[#EFE7F6] to-pastel-bg pt-4 pb-6 px-4 sm:px-6 border-b border-pastel-cardBorder';
        detailCard.className = 'bg-pastel-lilacBg rounded-3xl p-6 border border-white/80 shadow-sm text-center text-pastel-lilacText';
        fab.className = 'w-14 h-14 rounded-full bg-pastel-lilac text-white shadow-lg flex items-center justify-center';
      } else {
        typeLabel.textContent = 'Total Ahorros del Mes';
        headerBg.className = 'bg-gradient-to-b from-pastel-yellowBg via-[#FDF2D6] to-pastel-bg pt-4 pb-6 px-4 sm:px-6 border-b border-pastel-cardBorder';
        detailCard.className = 'bg-pastel-yellowBg rounded-3xl p-6 border border-white/80 shadow-sm text-center text-pastel-yellowText';
        fab.className = 'w-14 h-14 rounded-full bg-pastel-yellow text-white shadow-lg flex items-center justify-center';
      }

      // Desglose por categorías con barra delgada y porcentaje
      const list = document.getElementById('detailCategoriesList');
      list.innerHTML = '';
      const typeCats = categories.filter(c => c.type === type);

      typeCats.forEach(cat => {
        const catTxs = currentMonthTxs.filter(t => t.category_id === cat.id);
        const sum = catTxs.reduce((a, t) => a + Number(t.amount), 0);
        const pct = total > 0 ? (sum / total) * 100 : 0;

        const barColor = type === 'income' ? 'bg-pastel-sage' : type === 'expense' ? 'bg-pastel-lilac' : 'bg-pastel-yellow';

        list.innerHTML += \`
          <div class="bg-white rounded-2xl border border-pastel-cardBorder shadow-sm p-4 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-pastel-bg border border-pastel-cardBorder flex items-center justify-center text-xl shrink-0">
                  \${cat.icon_or_image_url}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">\${cat.name}</p>
                  <p class="text-xs text-slate-400">\${catTxs.length} movimiento\${catTxs.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-slate-800 tabular-nums">$ \${sum.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                <p class="text-[11px] font-medium text-slate-400 tabular-nums">\${pct.toFixed(1)}%</p>
              </div>
            </div>
            <!-- Barra de progreso delgada -->
            <div class="w-full bg-[#F3EFEA] h-1.5 rounded-full overflow-hidden">
              <div class="h-full rounded-full \${barColor}" style="width: \${pct}%"></div>
            </div>
            <!-- Subcategorías y desglose si hay -->
            \${catTxs.length > 0 ? \`
              <div class="pt-2 border-t border-slate-100 space-y-1.5">
                \${catTxs.map(t => {
                  const parts = t.date.split('-');
                  const ddmmaa = parts.length === 3 ? \`\${parts[2]}/\${parts[1]}/\${parts[0].slice(2)}\` : t.date;
                  return \`
                    <div class="flex items-center justify-between text-xs py-1 text-slate-600">
                      <div>
                        <span class="font-semibold text-slate-500">\${ddmmaa}</span>
                        \${t.subcategory ? \`<span class="ml-1 bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">\${t.subcategory}</span>\` : ''}
                        \${t.note ? \`<span class="ml-1 text-slate-400">· \${t.note}</span>\` : ''}
                      </div>
                      <span class="font-bold tabular-nums">$ \${Number(t.amount).toLocaleString('es-AR')}</span>
                    </div>
                  \`;
                }).join('')}
              </div>
            \` : ''}
          </div>
        \`;
      });

      lucide.createIcons();
    }

    function closeDetail() {
      document.getElementById('detailView').classList.add('hidden');
      document.getElementById('mainDashboard').classList.remove('hidden');
      renderDashboard();
    }

    // Modales
    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
      if (id === 'categoriesModal') renderCategoriesManager();
      if (id === 'budgetModal') renderBudgetsManager();
      lucide.createIcons();
    }

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    // Modal Registrar Movimiento
    function openAddTransactionModal(defaultType) {
      currentTxType = defaultType || 'expense';
      setTxType(currentTxType);

      const today = new Date();
      document.getElementById('txDate').value = \`\${today.getFullYear()}-\${String(today.getMonth()+1).padStart(2,'0')}-\${String(today.getDate()).padStart(2,'0')}\`;
      document.getElementById('txAmount').value = '';
      document.getElementById('txNote').value = '';
      document.getElementById('txSubcatInput').value = '';
      selectedSubcatForTx = '';

      openModal('txModal');
    }

    function setTxType(type) {
      currentTxType = type;
      ['Income', 'Expense', 'Saving'].forEach(t => {
        document.getElementById('btnTxType' + t).className = 'py-2 text-xs font-semibold rounded-xl text-slate-600';
      });
      const activeBtn = document.getElementById('btnTxType' + type.charAt(0).toUpperCase() + type.slice(1));
      if (type === 'income') activeBtn.className = 'py-2 text-xs font-semibold rounded-xl bg-pastel-sageBg text-pastel-sageText border border-pastel-sage/30 shadow-xs';
      if (type === 'expense') activeBtn.className = 'py-2 text-xs font-semibold rounded-xl bg-pastel-lilacBg text-pastel-lilacText border border-pastel-lilac/30 shadow-xs';
      if (type === 'saving') activeBtn.className = 'py-2 text-xs font-semibold rounded-xl bg-pastel-yellowBg text-pastel-yellowText border border-pastel-yellow/30 shadow-xs';

      renderTxCategoryGrid();
    }

    function renderTxCategoryGrid() {
      const grid = document.getElementById('txCategoryGrid');
      grid.innerHTML = '';
      const filtered = categories.filter(c => c.type === currentTxType);
      if (filtered.length > 0 && !filtered.some(c => c.id === selectedCatIdForTx)) {
        selectedCatIdForTx = filtered[0].id;
      }

      filtered.forEach(cat => {
        const isSel = cat.id === selectedCatIdForTx;
        grid.innerHTML += \`
          <button type="button" onclick="selectTxCategory('\${cat.id}')" class="p-2.5 rounded-xl border text-left flex items-center gap-2 \${isSel ? 'border-pastel-sage bg-pastel-bg ring-1 ring-pastel-sage' : 'border-pastel-cardBorder bg-white'}">
            <span class="text-base shrink-0">\${cat.icon_or_image_url}</span>
            <span class="text-xs font-semibold text-slate-700 truncate">\${cat.name}</span>
          </button>
        \`;
      });

      renderTxSubcatPills();
    }

    function selectTxCategory(id) {
      selectedCatIdForTx = id;
      selectedSubcatForTx = '';
      renderTxCategoryGrid();
    }

    function renderTxSubcatPills() {
      const cat = categories.find(c => c.id === selectedCatIdForTx);
      const container = document.getElementById('txSubcatPills');
      container.innerHTML = '';
      if (cat && cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          const isSel = sub === selectedSubcatForTx;
          container.innerHTML += \`
            <button type="button" onclick="selectSubcatPill('\${sub}')" class="text-xs px-2.5 py-1 rounded-xl \${isSel ? 'bg-pastel-sage text-white font-semibold' : 'bg-white border border-pastel-cardBorder text-slate-600'}">
              \${sub}
            </button>
          \`;
        });
      }
    }

    function selectSubcatPill(sub) {
      selectedSubcatForTx = selectedSubcatForTx === sub ? '' : sub;
      document.getElementById('txSubcatInput').value = selectedSubcatForTx;
      renderTxSubcatPills();
    }

    async function saveTransactionForm(e) {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('txAmount').value);
      const date = document.getElementById('txDate').value;
      const note = document.getElementById('txNote').value.trim();
      const subcat = document.getElementById('txSubcatInput').value.trim() || selectedSubcatForTx;

      if (!selectedCatIdForTx) {
        alert('Selecciona una categoría');
        return;
      }

      const newTx = {
        id: 'tx-' + Date.now(),
        type: currentTxType,
        category_id: selectedCatIdForTx,
        subcategory: subcat,
        amount,
        date,
        note
      };

      if (supabaseClient) {
        const { data, error } = await supabaseClient.from('transactions').insert([{
          type: newTx.type,
          category_id: newTx.category_id,
          subcategory: newTx.subcategory,
          amount: newTx.amount,
          date: newTx.date,
          note: newTx.note
        }]).select();
        if (!error && data && data[0]) {
          newTx.id = data[0].id;
        }
      }

      transactions.unshift(newTx);
      localStorage.setItem('finanzas_txs', JSON.stringify(transactions));
      closeModal('txModal');
      renderDashboard();
      if (!document.getElementById('detailView').classList.contains('hidden')) {
        showDetail(currentDetailType);
      }
    }

    async function deleteTransaction(id) {
      if (supabaseClient) {
        try {
          await supabaseClient.from('transactions').delete().eq('id', id);
        } catch(e) {}
      }
      transactions = transactions.filter(t => String(t.id) !== String(id));
      localStorage.setItem('finanzas_txs', JSON.stringify(transactions));
      renderDashboard();
      if (!document.getElementById('detailView').classList.contains('hidden')) {
        showDetail(currentDetailType);
      }
    }

    async function clearAllTransactions() {
      if (supabaseClient) {
        try {
          await supabaseClient.from('transactions').delete().neq('type', '_none_');
        } catch(e) {}
      }
      transactions = [];
      localStorage.setItem('finanzas_txs', JSON.stringify([]));
      renderDashboard();
      if (!document.getElementById('detailView').classList.contains('hidden')) {
        showDetail(currentDetailType);
      }
    }

    // Modal Categorías
    function setNewCatType(type) {
      newCatType = type;
      ['Expense', 'Income', 'Saving'].forEach(t => {
        document.getElementById('btnNewCat' + t).className = 'py-1 text-xs font-semibold rounded-lg text-slate-600';
      });
      document.getElementById('btnNewCat' + type.charAt(0).toUpperCase() + type.slice(1)).className = 'py-1 text-xs font-semibold rounded-lg bg-white shadow-xs';
    }

    function renderCategoriesManager() {
      const container = document.getElementById('categoriesListManager');
      container.innerHTML = '';
      categories.forEach(cat => {
        container.innerHTML += \`
          <div class="bg-white rounded-2xl p-3 border border-pastel-cardBorder flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">\${cat.icon_or_image_url}</span>
              <div>
                <p class="text-xs font-bold text-slate-800">\${cat.name}</p>
                <p class="text-[10px] text-slate-400">\${cat.type} · \${cat.subcategories ? cat.subcategories.join(', ') : 'Sin subcategorías'}</p>
              </div>
            </div>
            <button onclick="deleteCategory('\${cat.id}')" class="text-slate-300 hover:text-rose-600 p-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        \`;
      });
      lucide.createIcons();
    }

    async function saveCategoryForm(e) {
      e.preventDefault();
      const name = document.getElementById('newCatName').value.trim();
      const icon = document.getElementById('newCatIcon').value.trim() || '📁';
      const subsRaw = document.getElementById('newCatSubs').value.trim();
      const subcategories = subsRaw ? subsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

      const newCat = {
        id: 'cat-' + Date.now(),
        type: newCatType,
        name,
        icon_or_image_url: newCatBase64 || icon,
        subcategories
      };

      if (supabaseClient) {
        await supabaseClient.from('categories').insert([newCat]);
      }
      categories.push(newCat);
      localStorage.setItem('finanzas_cats', JSON.stringify(categories));

      document.getElementById('newCatName').value = '';
      document.getElementById('newCatSubs').value = '';
      newCatBase64 = '';
      renderCategoriesManager();
      renderDashboard();
    }

    async function deleteCategory(id) {
      if (!confirm('¿Eliminar categoría?')) return;
      if (supabaseClient) {
        await supabaseClient.from('categories').delete().eq('id', id);
      }
      categories = categories.filter(c => c.id !== id);
      localStorage.setItem('finanzas_cats', JSON.stringify(categories));
      renderCategoriesManager();
      renderDashboard();
    }

    // Manejo de imagen en categoría
    document.getElementById('newCatImageFile').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          newCatBase64 = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Presupuestos
    function renderBudgetsManager() {
      const select = document.getElementById('budgetCategorySelect');
      select.innerHTML = '';
      categories.filter(c => c.type === 'expense').forEach(c => {
        select.innerHTML += \`<option value="\${c.id}">\${c.icon_or_image_url} \${c.name}</option>\`;
      });

      const list = document.getElementById('activeBudgetsList');
      list.innerHTML = '';
      budgets.forEach(b => {
        const cat = categories.find(c => c.id === b.category_id);
        list.innerHTML += \`
          <div class="bg-white rounded-xl p-3 border border-pastel-cardBorder flex items-center justify-between text-xs">
            <span>\${cat ? cat.name : 'Categoría'}: <strong>$ \${Number(b.monthly_limit).toLocaleString('es-AR')}</strong></span>
            <button onclick="deleteBudget('\${b.id}')" class="text-slate-300 hover:text-rose-600"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        \`;
      });
      lucide.createIcons();
    }

    async function saveBudgetForm(e) {
      e.preventDefault();
      const catId = document.getElementById('budgetCategorySelect').value;
      const limit = parseFloat(document.getElementById('budgetLimitInput').value);

      const newB = { id: 'bud-' + Date.now(), category_id: catId, monthly_limit: limit };
      if (supabaseClient) {
        await supabaseClient.from('budgets').upsert([{ category_id: catId, monthly_limit: limit }]);
      }
      const idx = budgets.findIndex(b => b.category_id === catId);
      if (idx >= 0) budgets[idx] = newB;
      else budgets.push(newB);
      localStorage.setItem('finanzas_budgets', JSON.stringify(budgets));
      document.getElementById('budgetLimitInput').value = '';
      renderBudgetsManager();
      renderDashboard();
    }

    async function deleteBudget(id) {
      if (supabaseClient) await supabaseClient.from('budgets').delete().eq('id', id);
      budgets = budgets.filter(b => b.id !== id);
      localStorage.setItem('finanzas_budgets', JSON.stringify(budgets));
      renderBudgetsManager();
      renderDashboard();
    }

    // Configurar Supabase
    function saveSupabaseForm(e) {
      e.preventDefault();
      const url = document.getElementById('sbUrl').value.trim();
      const key = document.getElementById('sbKey').value.trim();
      if (url && key) {
        localStorage.setItem('finanzas_pastel_sb_cfg', JSON.stringify({ url, key }));
        initSupabase();
        alert('Configuración guardada. La página se recargará para conectar.');
        location.reload();
      }
    }

    function useDemoMode() {
      localStorage.removeItem('finanzas_pastel_sb_cfg');
      initSupabase();
      closeModal('dbModal');
      renderDashboard();
    }

    function copySqlScript() {
      navigator.clipboard.writeText(SQL_INIT_SCRIPT);
      const btn = document.getElementById('btnCopySql');
      btn.textContent = '¡Copiado!';
      setTimeout(() => btn.textContent = 'Copiar SQL', 2000);
    }

    // Start App
    window.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      checkPinStatus();
    });
  </script>
</body>
</html>`;
}
