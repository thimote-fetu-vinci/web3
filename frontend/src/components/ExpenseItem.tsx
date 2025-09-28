import {
  Box,
  Typography,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Person, CalendarToday, AttachMoney } from '@mui/icons-material';
import type { Expense } from '../types/Expense';

interface ExpenseItemProps {
  expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get avatar color based on payer
  const getAvatarColor = (payer: string) => {
    return payer === 'Bob' ? theme.palette.primary.main : theme.palette.secondary.main;
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        py: 2,
        gap: 2,
        flexDirection: isMobile ? 'column' : 'row'
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: getAvatarColor(expense.payer),
          width: isMobile ? 48 : 56,
          height: isMobile ? 48 : 56,
          fontSize: isMobile ? '1.2rem' : '1.4rem',
          fontWeight: 'bold'
        }}
      >
        {expense.payer.charAt(0)}
      </Avatar>

      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: isMobile ? '1rem' : '1.3rem'
          }}
        >
          {expense.description || 'No description'}
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1.5, 
            alignItems: 'center' 
          }}
        >
          <Chip
            icon={<Person />}
            label={expense.payer}
            size={isMobile ? "small" : "medium"}
            variant="outlined"
            color={expense.payer === 'Bob' ? 'primary' : 'secondary'}
          />
          <Chip
            icon={<CalendarToday />}
            label={formatDate(expense.date)}
            size={isMobile ? "small" : "medium"}
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Amount */}
      <Box sx={{ textAlign: 'right', minWidth: '120px' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.success.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 0.5,
            fontSize: isMobile ? '1.25rem' : '1.75rem'
          }}
        >
          <AttachMoney sx={{ fontSize: 'inherit' }} />
          {expense.amount.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}
