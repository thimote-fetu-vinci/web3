import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Stack,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { AttachMoney, CalendarToday, Description, Person } from '@mui/icons-material';
import type { Expense, ExpenseInput } from '../types/Expense';
import { expenseFormSchema, type ExpenseFormData } from '../types/ExpenseValidation';

interface ExpenseAddProps {
  addExpense: (expense: Expense) => void;
}

export default function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
    <Box sx={{ width: '100%' }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant={isMobile ? 'h6' : 'h5'} component="h2" color="primary">
              Add New Expense
            </Typography>
          }
          sx={{ pb: 1, pt: 2 }}
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>
              {/* Payer Field */}
              <Controller
                name="payer"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.payer}>
                    <InputLabel id="payer-label">Payer</InputLabel>
                    <Select
                      {...field}
                      labelId="payer-label"
                      label="Payer"
                      startAdornment={
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Bob">Bob</MenuItem>
                      <MenuItem value="Alice">Alice</MenuItem>
                    </Select>
                    {errors.payer && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.payer.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              {/* Date Field */}
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Date"
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />

              {/* Amount Field */}
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Amount"
                    placeholder="0.00"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    inputProps={{
                      step: 0.01,
                      min: 0,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
                )}
              />

              {/* Description Field */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    placeholder="Enter expense description (optional, max 200 chars)"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1DB5DB 90%)',
                  },
                }}
              >
                {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
