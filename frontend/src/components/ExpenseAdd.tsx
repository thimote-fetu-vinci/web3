import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Expense, ExpenseInput } from '../types/Expense';
import { expenseFormSchema, type ExpenseFormData } from '../types/ExpenseValidation';

interface ExpenseAddProps {
  addExpense: (expense: Expense) => void;
}

export default function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  // lightweight mobile check (not actively used here)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      payer: 'Bob' as const,
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    const dateTime = new Date(data.date).toISOString();
    
    const formData: ExpenseInput = {
      payer: data.payer,
      date: dateTime,
      description: data.description || '',
      amount: data.amount,
    };

    console.log('Form content:', formData);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newExpense = await response.json();
      addExpense(newExpense);
      
      // Reset form
      reset({
        payer: 'Bob' as const,
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
      });
      
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <div>
          <label>Payer</label>
          <Controller
            name="payer"
            control={control}
            render={({ field }) => (
              <select {...field}>
                <option value="Bob">Bob</option>
                <option value="Alice">Alice</option>
              </select>
            )}
          />
          {errors.payer && <div>{errors.payer.message}</div>}
        </div>

        <div>
          <label>Date</label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <input {...field} type="date" />
            )}
          />
          {errors.date && <div>{errors.date.message}</div>}
        </div>

        <div>
          <label>Amount</label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  field.onChange(isNaN(value) ? 0 : value);
                }}
              />
            )}
          />
          {errors.amount && <div>{errors.amount.message}</div>}
        </div>

        <div>
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea {...field} rows={2} />
            )}
          />
          {errors.description && <div>{errors.description.message}</div>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
