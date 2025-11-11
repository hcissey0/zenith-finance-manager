export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Account {
  id: string;
  name: string;
  currency: string;
  icon: string;
  color: string;
}

export type Page = "dashboard" | "transactions" | "accounts" | "settings";

export type QuickLogType =
  | "lorry"
  | "food"
  | "salary"
  | "bill"
  | "gift-in"
  | "gift-out"
  | "charity"
  | "momo-charges"
  | "misc";
