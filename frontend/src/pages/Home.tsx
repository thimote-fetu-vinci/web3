import { useState, useEffect } from "react";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseAdd from "../components/ExpenseAdd";
import ExpenseSorter from "../components/ExpenseSorter";
import type { Expense } from "../types/Expense";

const host = import.meta.env.VITE_API_URL || "http://unknown-api-url.com";

export default function Home() {
  const [sortingAlgo, setSortingAlgo] = useState<
    (a: Expense, b: Expense) => number
  >(() => () => 0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const sendApiRequestandHandleError = async (
    method: string = "GET",
    path: string,
    body?: any
  ) => {
    try {
      const response = await fetch(`${host}/api/${path}`, {
        method: method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await sendApiRequestandHandleError("GET", "expenses");
      if (data && Array.isArray(data)) {
        setExpenses(data);
        setError(null);
      } else {
        setExpenses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (newExpense: Expense) => {
    const newExpensesOptimistic = [newExpense, ...expenses]; // Optimistically update the state, whatever the sort method, add on top
    setExpenses(newExpensesOptimistic);
    const addedExpense = await sendApiRequestandHandleError(
      "POST",
      "expenses",
      newExpense
    );
    const newExpensesActual = [addedExpense, ...expenses]; // Now that we have the actual added expense with id from backend, let's use it instead of the optimistically added one
    setExpenses(newExpensesActual);
  };

  const handleResetData = async () => {
    try {
      setIsResetting(true);
      setExpenses([]);

      const response = await sendApiRequestandHandleError(
        "POST",
        "expenses/reset"
      );

      if (response && response.data) {
        setExpenses(response.data);
        setError(null);
      } else {
        await fetchExpenses();
      }
    } catch (error) {
      console.error("Error resetting expenses:", error);
      setError("Failed to reset expenses. Please try again.");
      await fetchExpenses();
    } finally {
      setIsResetting(false);
    }
  };

  const handleAlgoChange = (algo: (a: Expense, b: Expense) => number) => {
    setSortingAlgo(() => algo);
  };

  const sortedExpenses = expenses.sort(sortingAlgo);

  if (loading) return <div>Loading expenses...</div>;

  return (
    <div>
      <header>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            justifyContent: "center",
            display: "flex",
          }}
        >
          Expenso Sharing App
        </h1>
      </header>

      {error && <div>{error}</div>}

      <main>
        <div>
          <ExpenseAdd addExpense={handleAddExpense} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={handleResetData} disabled={isResetting}>
              {isResetting ? "Resetting..." : "Reset Data"}
            </button>
          </div>
        </div>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <h2>{`Expenses (${expenses.length})`}</h2>
          </div>

          {expenses.length > 0 && (
            <ExpenseSorter setSortingAlgo={handleAlgoChange} />
          )}

          <div>
            {sortedExpenses.length === 0 ? (
              <div>
                <div>No expenses found</div>
                <div>Add your first expense using the form on the left!</div>
              </div>
            ) : (
              <div>
                {sortedExpenses.map((expense) => (
                  <div key={expense.id}>
                    <ExpenseItem expense={expense} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
