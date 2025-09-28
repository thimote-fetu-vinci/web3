import { z } from 'zod';

export const expenseFormSchema = z.object({
  payer: z.enum(['Bob', 'Alice'], {
    message: 'User must be either "Bob" or "Alice"'
  }),
  date: z.string().min(1, 'Date is required'),
  description: z.string().max(200, 'Description cannot be longer than 200 characters').optional(),
  amount: z.number().positive('Amount must be a positive number'),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;