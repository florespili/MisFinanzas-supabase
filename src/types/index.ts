export type TransactionType = 'income' | 'expense' | 'saving';

export interface Category {
  id: string;
  type: TransactionType;
  name: string;
  icon_or_image_url: string; // emoji or base64 data url or image url
  subcategories: string[];
  color?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category_id: string;
  subcategory: string;
  amount: number;
  date: string; // YYYY-MM-DD
  note?: string;
  created_at?: string;
}

export interface Budget {
  id: string;
  category_id: string;
  monthly_limit: number;
}

export interface AppConfig {
  id?: string;
  pin_hash: string;
  created_at?: string;
}

export interface SupabaseCredentials {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
