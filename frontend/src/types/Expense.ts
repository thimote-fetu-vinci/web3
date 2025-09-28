import type { Identifiable } from './Core';

export interface ExpenseInput {
  payer: string;
  date: string;
  description: string;
  amount: number;
}

export interface Expense extends Identifiable {
  date: string;
  description: string;
  payer: string;
  amount: number;
}
