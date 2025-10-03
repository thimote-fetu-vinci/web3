import type { Expense } from '../types/Expense';

interface ExpenseItemProps {
  expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div>{expense.payer.charAt(0)}</div>
      <div>
        <div>{expense.description || 'No description'}</div>
        <div>
          <span>👤 {expense.payer}</span>
          <span> 📅 {formatDate(expense.date)}</span>
        </div>
      </div>
      <div>
        <span>💲 {expense.amount.toFixed(2)}</span>
      </div>
    </div>
  );
}
