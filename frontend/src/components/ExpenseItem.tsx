import type { Expense } from '../types/Expense';

interface ExpenseItemProps {
  expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>#{expense.id}</div>
      <div>{expense.date}</div>
      <div>{expense.description}</div>
      <div>{expense.payer}</div>
      <div>${expense.amount.toFixed(2)}</div>
    </div>
  );
}
