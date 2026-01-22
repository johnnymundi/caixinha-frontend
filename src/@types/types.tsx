export type Category = {
  id: number;
  name: string;
  created_at: string;
};

export type TxType = "IN" | "OUT";

export type Transaction = {
  id: number;
  type: TxType;
  amount: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: number | null;
  category_name?: string;
  created_at: string;
};

export type Summary = {
  month: string; // YYYY-MM
  income: string;
  expense: string;
  balance_month: string;
  balance_total: string;
  by_category: Array<{
    category__id: number | null;
    category__name: string | null;
    type: TxType;
    total: string;
  }>;
};
