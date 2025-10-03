import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Expense, ExpenseInput } from "../types/Expense";
import {
  expenseFormSchema,
  type ExpenseFormData,
} from "../types/ExpenseValidation";

interface ExpenseAddProps {
  addExpense: (expense: Expense) => void;
}

export default function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      payer: "Bob" as const,
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: 0,
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    const dateTime = new Date(data.date).toISOString();

    const formData: ExpenseInput = {
      payer: data.payer,
      date: dateTime,
      description: data.description || "",
      amount: data.amount,
    };

    console.log("Form content:", formData);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        payer: "Bob" as const,
        date: new Date(Date.now()).toISOString().split("T")[0],
        description: "",
        amount: 0,
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to create expense. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxWidth: "500px", margin: "auto" }}>
        <div>
          <textarea name="description" rows={1} />
          {errors.description && <div>{errors.description.message}</div>}
        </div>

        <div>
          <select name="payer">
            <option value="Bob">Bob</option>
            <option value="Alice">Alice</option>
          </select>
          {errors.payer && <div>{errors.payer.message}</div>}
        </div>

        <div>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
          {errors.amount && <div>{errors.amount.message}</div>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Expense..." : "Add"}
        </button>
      </div>
    </form>
  );
}
