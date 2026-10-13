import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Category, Transaction, Budget, AppConfig } from '../types/index.ts';

const SUPABASE_STORAGE_KEY = 'finanzas_pastel_supabase_config';
const LOCAL_PIN_KEY = 'finanzas_pastel_pin_hash';
const LOCAL_CATEGORIES_KEY = 'finanzas_pastel_categories';
const LOCAL_TRANSACTIONS_KEY = 'finanzas_pastel_transactions';
const LOCAL_BUDGETS_KEY = 'finanzas_pastel_budgets';

// Default initial categories in Mujer Financiera pastel style
export const DEFAULT_CATEGORIES: Category[] = [
  // Gastos
  {
    id: 'cat-exp-1',
    type: 'expense',
    name: 'Alimentación & Super',
    icon_or_image_url: '🥑',
    subcategories: ['Supermercado', 'Verdulería', 'Cafés & Salidas', 'Delivery'],
    color: '#D6C7E2',
  },
  {
    id: 'cat-exp-2',
    type: 'expense',
    name: 'Hogar & Servicios',
    icon_or_image_url: '🏡',
    subcategories: ['Alquiler', 'Luz & Gas', 'Internet & Teléfono', 'Mantenimiento'],
    color: '#D4C4EB',
  },
  {
    id: 'cat-exp-3',
    type: 'expense',
    name: 'Transporte',
    icon_or_image_url: '🚗',
    subcategories: ['Combustible', 'Transporte público', 'Seguro & Patente', 'Mantenimiento'],
    color: '#C5B4E3',
  },
  {
    id: 'cat-exp-4',
    type: 'expense',
    name: 'Salud & Bienestar',
    icon_or_image_url: '🧘‍♀️',
    subcategories: ['Medicina & Farmacia', 'Gimnasio / Yoga', 'Cuidado personal'],
    color: '#E8D7F1',
  },
  {
    id: 'cat-exp-5',
    type: 'expense',
    name: 'Educación & Cursos',
    icon_or_image_url: '📚',
    subcategories: ['Cursos online', 'Libros', 'Capacitaciones'],
    color: '#D6C7E2',
  },
  {
    id: 'cat-exp-6',
    type: 'expense',
    name: 'Ocio & Salidas',
    icon_or_image_url: '✨',
    subcategories: ['Cena con amigas', 'Cine & Teatro', 'Paseos'],
    color: '#E0D0F5',
  },

  // Ingresos
  {
    id: 'cat-inc-1',
    type: 'income',
    name: 'Sueldo Principal',
    icon_or_image_url: '💼',
    subcategories: ['Salario mensual', 'Aguinaldo / Bono'],
    color: '#8E9F7C',
  },
  {
    id: 'cat-inc-2',
    type: 'income',
    name: 'Emprendimiento / Freelance',
    icon_or_image_url: '🌱',
    subcategories: ['Clientes', 'Venta de productos', 'Asesorías'],
    color: '#9EB08F',
  },
  {
    id: 'cat-inc-3',
    type: 'income',
    name: 'Inversiones & Rentas',
    icon_or_image_url: '📈',
    subcategories: ['Dividendos', 'Intereses plazos fijos', 'Rentas'],
    color: '#A7B899',
  },

  // Ahorros
  {
    id: 'cat-sav-1',
    type: 'saving',
    name: 'Fondo de Emergencia',
    icon_or_image_url: '🛡️',
    subcategories: ['Reserva 3 meses', 'Colchón de tranquilidad'],
    color: '#E5C86F',
  },
  {
    id: 'cat-sav-2',
    type: 'saving',
    name: 'Vacaciones & Viajes',
    icon_or_image_url: '✈️',
    subcategories: ['Pasajes', 'Alojamiento'],
    color: '#E8CF7A',
  },
  {
    id: 'cat-sav-3',
    type: 'saving',
    name: 'Metas a Largo Plazo',
    icon_or_image_url: '⭐',
    subcategories: ['Inversión futura', 'Casa propia'],
    color: '#ECD587',
  },
];

// Helper to calculate SHA-256 hash of a string
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class FinanceService {
  private static instance: FinanceService;
  private client: SupabaseClient | null = null;
  private isConfigured: boolean = false;

  private constructor() {
    this.initClient();
  }

  public static getInstance(): FinanceService {
    if (!FinanceService.instance) {
      FinanceService.instance = new FinanceService();
    }
    return FinanceService.instance;
  }

  private initClient() {
    try {
      const stored = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (stored) {
        const { url, anonKey } = JSON.parse(stored);
        if (url && anonKey && url.startsWith('http')) {
          this.client = createClient(url, anonKey);
          this.isConfigured = true;
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading stored Supabase config:', e);
    }
    this.client = null;
    this.isConfigured = false;
  }

  public getSupabaseConfig(): { url: string; anonKey: string; isConnected: boolean } {
    try {
      const stored = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          url: parsed.url || '',
          anonKey: parsed.anonKey || '',
          isConnected: this.isConfigured,
        };
      }
    } catch (e) {
      console.warn(e);
    }
    return { url: '', anonKey: '', isConnected: false };
  }

  public setSupabaseConfig(url: string, anonKey: string) {
    if (!url.trim() || !anonKey.trim()) {
      localStorage.removeItem(SUPABASE_STORAGE_KEY);
      this.client = null;
      this.isConfigured = false;
      return;
    }
    localStorage.setItem(
      SUPABASE_STORAGE_KEY,
      JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
    );
    this.client = createClient(url.trim(), anonKey.trim());
    this.isConfigured = true;
  }

  public async testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const testClient = createClient(url.trim(), anonKey.trim());
      // Test querying app_config
      const { error } = await testClient.from('app_config').select('id').limit(1);
      if (error) {
        // Table might not exist yet or permission denied
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión' };
    }
  }

  // ================= PIN SECURITY ================= //

  public async isPinConfigured(): Promise<{ configured: boolean; mode: 'supabase' | 'local' }> {
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('app_config')
          .select('pin_hash')
          .limit(1);

        if (error) {
          console.error('Supabase app_config query error, fallback to local:', error);
          const localPin = localStorage.getItem(LOCAL_PIN_KEY);
          return { configured: !!localPin, mode: 'local' };
        }

        if (data && data.length > 0 && data[0].pin_hash) {
          return { configured: true, mode: 'supabase' };
        }
        return { configured: false, mode: 'supabase' };
      } catch (e) {
        console.error(e);
      }
    }

    // Local mode
    const localPin = localStorage.getItem(LOCAL_PIN_KEY);
    return { configured: !!localPin, mode: 'local' };
  }

  public async verifyPin(pin: string): Promise<boolean> {
    const hashed = await sha256(pin);

    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('app_config')
          .select('pin_hash')
          .limit(1);

        if (!error && data && data.length > 0) {
          return data[0].pin_hash === hashed;
        }
      } catch (e) {
        console.error('Error verifying pin on Supabase:', e);
      }
    }

    // Local fallback
    const localPin = localStorage.getItem(LOCAL_PIN_KEY);
    return localPin === hashed;
  }

  public async setupInitialPin(pin: string): Promise<{ success: boolean; error?: string }> {
    const hashed = await sha256(pin);

    if (this.isConfigured && this.client) {
      try {
        // Check if a PIN already exists to prevent overwrite from public link!
        const { data: existing, error: checkError } = await this.client
          .from('app_config')
          .select('id')
          .limit(1);

        if (checkError) {
          return { success: false, error: checkError.message };
        }

        if (existing && existing.length > 0) {
          return {
            success: false,
            error: 'Ya existe un PIN configurado en la base de datos de Supabase. Acceso denegado.',
          };
        }

        const { error: insertError } = await this.client.from('app_config').insert([
          { pin_hash: hashed },
        ]);

        if (insertError) {
          return { success: false, error: insertError.message };
        }

        // Also seed default categories if empty in Supabase
        await this.seedDefaultCategoriesInSupabase();

        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    // Local fallback
    const existingLocal = localStorage.getItem(LOCAL_PIN_KEY);
    if (existingLocal) {
      return { success: false, error: 'Ya existe un PIN configurado localmente.' };
    }
    localStorage.setItem(LOCAL_PIN_KEY, hashed);
    return { success: true };
  }

  private async seedDefaultCategoriesInSupabase() {
    if (!this.client) return;
    try {
      const { data } = await this.client.from('categories').select('id').limit(1);
      if (!data || data.length === 0) {
        const payload = DEFAULT_CATEGORIES.map((c) => ({
          id: c.id,
          type: c.type,
          name: c.name,
          icon_or_image_url: c.icon_or_image_url,
          subcategories: c.subcategories,
        }));
        await this.client.from('categories').insert(payload);
      }
    } catch (e) {
      console.warn('Could not seed default categories in Supabase:', e);
    }
  }

  // ================= CATEGORIES ================= //

  public async getCategories(): Promise<Category[]> {
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('categories')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            type: d.type,
            name: d.name,
            icon_or_image_url: d.icon_or_image_url,
            subcategories: Array.isArray(d.subcategories) ? d.subcategories : [],
            color: d.color,
          }));
        }
      } catch (e) {
        console.error('Error fetching categories from Supabase:', e);
      }
    }

    // Local fallback
    const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }

    // Store default
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }

  public async saveCategory(cat: Category): Promise<Category> {
    if (this.isConfigured && this.client) {
      try {
        const payload = {
          id: cat.id,
          type: cat.type,
          name: cat.name,
          icon_or_image_url: cat.icon_or_image_url,
          subcategories: cat.subcategories,
        };
        const { data, error } = await this.client
          .from('categories')
          .upsert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          return {
            id: data[0].id,
            type: data[0].type,
            name: data[0].name,
            icon_or_image_url: data[0].icon_or_image_url,
            subcategories: data[0].subcategories || [],
          };
        }
      } catch (e) {
        console.error('Error saving category to Supabase:', e);
      }
    }

    // Local storage
    const categories = await this.getCategories();
    const existingIndex = categories.findIndex((c) => c.id === cat.id);
    let updated: Category[];
    if (existingIndex >= 0) {
      updated = [...categories];
      updated[existingIndex] = cat;
    } else {
      updated = [cat, ...categories];
    }
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
    return cat;
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      if (local) {
        const categories: Category[] = JSON.parse(local);
        const updated = categories.filter((c) => c.id !== id);
        localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Error deleting local category:', e);
    }

    if (this.isConfigured && this.client) {
      try {
        await this.client.from('categories').delete().eq('id', id);
      } catch (e) {
        console.error('Error deleting category from Supabase:', e);
      }
    }
  }

  // ================= TRANSACTIONS ================= //

  public async getTransactions(year?: number, month?: number): Promise<Transaction[]> {
    let txs: Transaction[] = [];

    if (this.isConfigured && this.client) {
      try {
        let query = this.client.from('transactions').select('*').order('date', { ascending: false });
        if (year !== undefined && month !== undefined) {
          const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
          // End date
          const nextMonth = month === 11 ? 0 : month + 1;
          const nextYear = month === 11 ? year + 1 : year;
          const endDate = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`;
          query = query.gte('date', startDate).lt('date', endDate);
        }
        const { data, error } = await query;
        if (!error && data) {
          txs = data.map((d: any) => ({
            id: d.id,
            type: d.type,
            category_id: d.category_id,
            subcategory: d.subcategory || '',
            amount: Number(d.amount),
            date: d.date,
            note: d.note,
            created_at: d.created_at,
          }));
          return txs;
        }
      } catch (e) {
        console.error('Error fetching transactions from Supabase:', e);
      }
    }

    // Local fallback
    const local = localStorage.getItem(LOCAL_TRANSACTIONS_KEY);
    if (local !== null) {
      try {
        txs = JSON.parse(local);
      } catch (e) {
        txs = [];
      }
    } else {
      // Seed nice initial sample demo transactions for the current and prior month
      const today = new Date();
      const currYear = today.getFullYear();
      const currMonth = String(today.getMonth() + 1).padStart(2, '0');
      txs = [
        {
          id: 'tx-1',
          type: 'income',
          category_id: 'cat-inc-1',
          subcategory: 'Salario mensual',
          amount: 2500,
          date: `${currYear}-${currMonth}-01`,
          note: 'Ingreso mensual nómina',
        },
        {
          id: 'tx-2',
          type: 'expense',
          category_id: 'cat-exp-1',
          subcategory: 'Supermercado',
          amount: 320,
          date: `${currYear}-${currMonth}-03`,
          note: 'Compra mensual de alimentos',
        },
        {
          id: 'tx-3',
          type: 'expense',
          category_id: 'cat-exp-2',
          subcategory: 'Alquiler',
          amount: 650,
          date: `${currYear}-${currMonth}-05`,
          note: 'Pago alquiler del mes',
        },
        {
          id: 'tx-4',
          type: 'expense',
          category_id: 'cat-exp-3',
          subcategory: 'Combustible',
          amount: 85,
          date: `${currYear}-${currMonth}-07`,
          note: 'Tanque lleno',
        },
        {
          id: 'tx-5',
          type: 'saving',
          category_id: 'cat-sav-1',
          subcategory: 'Reserva 3 meses',
          amount: 300,
          date: `${currYear}-${currMonth}-08`,
          note: 'Aporte a colchón de paz mental',
        },
        {
          id: 'tx-6',
          type: 'expense',
          category_id: 'cat-exp-6',
          subcategory: 'Cena con amigas',
          amount: 65,
          date: `${currYear}-${currMonth}-10`,
          note: 'Cena cumple Sofia',
        },
      ];
      localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(txs));
    }

    if (year !== undefined && month !== undefined) {
      const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
      return txs.filter((t) => t.date.startsWith(prefix));
    }

    return txs;
  }

  public async addTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    const id = 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newTx: Transaction = { ...tx, id, created_at: new Date().toISOString() };

    if (this.isConfigured && this.client) {
      try {
        const payload = {
          type: newTx.type,
          category_id: newTx.category_id,
          subcategory: newTx.subcategory,
          amount: newTx.amount,
          date: newTx.date,
          note: newTx.note,
        };
        const { data, error } = await this.client
          .from('transactions')
          .insert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          newTx.id = data[0].id;
        }
      } catch (e) {
        console.error('Error adding transaction to Supabase:', e);
      }
    }

    // Always keep local in sync
    const all = await this.getTransactions();
    const updated = [newTx, ...all];
    localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(updated));
    return newTx;
  }

  public async deleteTransaction(id: string): Promise<boolean> {
    let deleted = false;
    try {
      const local = localStorage.getItem(LOCAL_TRANSACTIONS_KEY);
      if (local !== null) {
        const txs: Transaction[] = JSON.parse(local);
        const updated = txs.filter((t) => String(t.id) !== String(id));
        localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(updated));
        deleted = true;
      }
    } catch (e) {
      console.warn('Error deleting local transaction:', e);
    }

    if (this.isConfigured && this.client) {
      try {
        const { error } = await this.client.from('transactions').delete().eq('id', id);
        if (error) {
          console.error('Error deleting transaction from Supabase:', error);
        } else {
          deleted = true;
        }
      } catch (e) {
        console.error('Error deleting transaction from Supabase:', e);
      }
    }
    return deleted;
  }

  public async deleteAllTransactions(): Promise<void> {
    localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify([]));
    if (this.isConfigured && this.client) {
      try {
        await this.client.from('transactions').delete().neq('type', '_none_');
      } catch (e) {
        console.error('Error deleting all transactions from Supabase:', e);
      }
    }
  }

  public async deleteTransactionsByMonth(year: number, month: number): Promise<void> {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    try {
      const local = localStorage.getItem(LOCAL_TRANSACTIONS_KEY);
      if (local !== null) {
        const txs: Transaction[] = JSON.parse(local);
        const updated = txs.filter((t) => !t.date.startsWith(prefix));
        localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Error deleting month transactions:', e);
    }

    if (this.isConfigured && this.client) {
      try {
        const startDate = `${prefix}-01`;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        const endDate = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`;
        await this.client.from('transactions').delete().gte('date', startDate).lt('date', endDate);
      } catch (e) {
        console.error('Error deleting month transactions from Supabase:', e);
      }
    }
  }

  public async resetDemoData(): Promise<void> {
    localStorage.removeItem(LOCAL_CATEGORIES_KEY);
    localStorage.removeItem(LOCAL_TRANSACTIONS_KEY);
    localStorage.removeItem(LOCAL_BUDGETS_KEY);
  }

  // ================= BUDGETS ================= //

  public async getBudgets(): Promise<Budget[]> {
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client.from('budgets').select('*');
        if (!error && data) {
          return data.map((b: any) => ({
            id: b.id,
            category_id: b.category_id,
            monthly_limit: Number(b.monthly_limit),
          }));
        }
      } catch (e) {
        console.error('Error fetching budgets from Supabase:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_BUDGETS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    // Default sample budgets
    const defaults: Budget[] = [
      { id: 'bud-1', category_id: 'cat-exp-1', monthly_limit: 500 },
      { id: 'bud-2', category_id: 'cat-exp-6', monthly_limit: 150 },
    ];
    localStorage.setItem(LOCAL_BUDGETS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  public async saveBudget(budget: Budget): Promise<Budget> {
    if (this.isConfigured && this.client) {
      try {
        const payload = {
          id: budget.id.startsWith('bud-') ? undefined : budget.id,
          category_id: budget.category_id,
          monthly_limit: budget.monthly_limit,
        };
        const { data, error } = await this.client
          .from('budgets')
          .upsert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          budget.id = data[0].id;
        }
      } catch (e) {
        console.error('Error saving budget to Supabase:', e);
      }
    }

    const budgets = await this.getBudgets();
    const existingIndex = budgets.findIndex((b) => b.category_id === budget.category_id);
    let updated: Budget[];
    if (existingIndex >= 0) {
      updated = [...budgets];
      updated[existingIndex] = budget;
    } else {
      updated = [...budgets, budget];
    }
    localStorage.setItem(LOCAL_BUDGETS_KEY, JSON.stringify(updated));
    return budget;
  }

  public async deleteBudget(id: string): Promise<void> {
    try {
      const local = localStorage.getItem(LOCAL_BUDGETS_KEY);
      if (local) {
        const budgets: Budget[] = JSON.parse(local);
        const updated = budgets.filter((b) => b.id !== id);
        localStorage.setItem(LOCAL_BUDGETS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Error deleting local budget:', e);
    }

    if (this.isConfigured && this.client) {
      try {
        await this.client.from('budgets').delete().eq('id', id);
      } catch (e) {
        console.error('Error deleting budget from Supabase:', e);
      }
    }
  }

  public async clearAllLocalTransactions(): Promise<void> {
    localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify([]));
    if (this.isConfigured && this.client) {
      try {
        await this.client.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.error(e);
      }
    }
  }

  // ================= SQL SCRIPT ================= //

  public static getSqlScript(): string {
    return `-- ==========================================================
-- SCRIPT DE INICIALIZACIÓN PARA SUPABASE (Finanzas Pastel)
-- Copia y pega esto en el SQL Editor de tu proyecto en Supabase
-- ==========================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Configuración de la App (Seguridad con PIN)
CREATE TABLE IF NOT EXISTS public.app_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pin_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REGLA DE SEGURIDAD: Solo permitir 1 registro de PIN en app_config
-- Esto evita que usuarios no autorizados sobrescriban tu PIN desde el link público
CREATE OR REPLACE FUNCTION check_single_app_config()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.app_config) >= 1 THEN
        RAISE EXCEPTION 'La configuración de seguridad ya existe. No se permite crear ni sobrescribir otro PIN.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_single_app_config ON public.app_config;
CREATE TRIGGER trigger_single_app_config
    BEFORE INSERT ON public.app_config
    FOR EACH ROW
    EXECUTE FUNCTION check_single_app_config();

-- 3. Tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'saving')),
    name TEXT NOT NULL,
    icon_or_image_url TEXT NOT NULL,
    subcategories JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Transacciones (Movimientos)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'saving')),
    category_id TEXT NOT NULL,
    subcategory TEXT DEFAULT '',
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL,
    note TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Presupuestos
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id TEXT NOT NULL,
    monthly_limit NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Habilitar Row Level Security (RLS) con políticas para acceso anónimo / dueño
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para la anon_key del dueño de la app personal:
DROP POLICY IF EXISTS "Permitir lectura app_config" ON public.app_config;
CREATE POLICY "Permitir lectura app_config" ON public.app_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserción inicial app_config" ON public.app_config;
CREATE POLICY "Permitir inserción inicial app_config" ON public.app_config FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo a categories" ON public.categories;
CREATE POLICY "Acceso completo a categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo a transactions" ON public.transactions;
CREATE POLICY "Acceso completo a transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo a budgets" ON public.budgets;
CREATE POLICY "Acceso completo a budgets" ON public.budgets FOR ALL USING (true) WITH CHECK (true);

-- 7. Categorías iniciales por defecto inspiradas en Mujer Financiera
INSERT INTO public.categories (id, type, name, icon_or_image_url, subcategories)
VALUES 
  ('cat-exp-1', 'expense', 'Alimentación & Super', '🥑', '["Supermercado", "Verdulería", "Cafés & Salidas", "Delivery"]'::jsonb),
  ('cat-exp-2', 'expense', 'Hogar & Servicios', '🏡', '["Alquiler", "Luz & Gas", "Internet & Teléfono", "Mantenimiento"]'::jsonb),
  ('cat-exp-3', 'expense', 'Transporte', '🚗', '["Combustible", "Transporte público", "Seguro & Patente", "Mantenimiento"]'::jsonb),
  ('cat-exp-4', 'expense', 'Salud & Bienestar', '🧘‍♀️', '["Medicina & Farmacia", "Gimnasio / Yoga", "Cuidado personal"]'::jsonb),
  ('cat-exp-5', 'expense', 'Educación & Cursos', '📚', '["Cursos online", "Libros", "Capacitaciones"]'::jsonb),
  ('cat-exp-6', 'expense', 'Ocio & Salidas', '✨', '["Cena con amigas", "Cine & Teatro", "Paseos"]'::jsonb),
  ('cat-inc-1', 'income', 'Sueldo Principal', '💼', '["Salario mensual", "Aguinaldo / Bono"]'::jsonb),
  ('cat-inc-2', 'income', 'Emprendimiento / Freelance', '🌱', '["Clientes", "Venta de productos", "Asesorías"]'::jsonb),
  ('cat-inc-3', 'income', 'Inversiones & Rentas', '📈', '["Dividendos", "Intereses plazos fijos", "Rentas"]'::jsonb),
  ('cat-sav-1', 'saving', 'Fondo de Emergencia', '🛡️', '["Reserva 3 meses", "Colchón de tranquilidad"]'::jsonb),
  ('cat-sav-2', 'saving', 'Vacaciones & Viajes', '✈️', '["Pasajes", "Alojamiento"]'::jsonb),
  ('cat-sav-3', 'saving', 'Metas a Largo Plazo', '⭐', '["Inversión futura", "Casa propia"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
`;
  }
}
