import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
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
      setExpenses([]); // Clear current expenses optimistically

      const response = await sendApiRequestandHandleError(
        "POST",
        "expenses/reset"
      );
      
      if (response && response.data) {
        setExpenses(response.data);
        setError(null);
      } else {
        // If no data in response, fetch fresh data
        await fetchExpenses();
      }
    } catch (error) {
      console.error('Error resetting expenses:', error);
      setError('Failed to reset expenses. Please try again.');
      // Try to fetch current expenses as fallback
      await fetchExpenses();
    } finally {
      setIsResetting(false);
    }
  };

  const handleAlgoChange = (algo: (a: Expense, b: Expense) => number) => {
    setSortingAlgo(() => algo); // Pay attention here, we're wrapping algo in a function because useState setter accept either a value or a function returning a value.
  };

  const sortedExpenses = expenses.sort(sortingAlgo);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading expenses...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          💰 Expenso
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track and manage your expenses with ease
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content - Column Layout on Desktop */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          alignItems: 'flex-start'
        }}
      >
        {/* Left Column - Add Expense Form & Actions */}
        <Box 
          sx={{ 
            flex: isMobile ? '1' : '0 0 320px',
            position: isMobile ? 'static' : 'sticky', 
            top: 24,
            width: isMobile ? '100%' : '320px',
            minWidth: '320px'
          }}
        >
          {/* Add Expense Form */}
          <ExpenseAdd addExpense={handleAddExpense} />
          
          {/* Actions */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="outlined"
              startIcon={isResetting ? <CircularProgress size={16} /> : <Refresh />}
              onClick={handleResetData}
              disabled={isResetting}
              size="large"
              fullWidth={isMobile}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
              }}
            >
              {isResetting ? 'Resetting...' : 'Reset Data'}
            </Button>
          </Box>
        </Box>

        {/* Right Column - Expenses List */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Expenses Section Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
            <Typography variant={isMobile ? "h5" : "h4"} component="h2">
              Expenses
            </Typography>
            <Chip 
              label={`${expenses.length} ${expenses.length === 1 ? 'expense' : 'expenses'}`} 
              color="primary" 
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
          </Box>

          {/* Sorting Controls */}
          {expenses.length > 0 && (
            <Box mb={3}>
              <ExpenseSorter setSortingAlgo={handleAlgoChange} />
            </Box>
          )}

          {/* Expenses List */}
          <Paper elevation={1} sx={{ p: 2 }}>
            {sortedExpenses.length === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No expenses found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first expense using the form on the {isMobile ? 'top' : 'left'}!
                </Typography>
              </Box>
            ) : (
              <Box>
                {sortedExpenses.map((expense, index) => (
                  <Box key={expense.id}>
                    <ExpenseItem expense={expense} />
                    {index < sortedExpenses.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
