import { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Sort } from '@mui/icons-material';
import type { Expense } from '../types/Expense';

type SortOption = 'date-newest' | 'date-oldest' | 'amount-highest' | 'amount-lowest';
type SortingAlgo = (a: Expense, b: Expense) => number;

interface ExpenseSorterProps {
  setSortingAlgo: (algo: SortingAlgo) => void;
}

const dateNewestAlgo: SortingAlgo = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();
const dateOldestAlgo: SortingAlgo = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();
const amountHighestAlgo: SortingAlgo = (a, b) => b.amount - a.amount;
const amountLowestAlgo: SortingAlgo = (a, b) => a.amount - b.amount;

export default function ExpenseSorter({ setSortingAlgo }: ExpenseSorterProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date-newest');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSortChange = (event: any) => {
    const newSortOption = event.target.value as SortOption;
    setSortBy(newSortOption);

    switch (newSortOption) {
      case 'date-newest':
        setSortingAlgo(dateNewestAlgo);
        break;
      case 'date-oldest':
        setSortingAlgo(dateOldestAlgo);
        break;
      case 'amount-highest':
        setSortingAlgo(amountHighestAlgo);
        break;
      case 'amount-lowest':
        setSortingAlgo(amountLowestAlgo);
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Sort color="action" />
      <Typography variant="body1" sx={{ minWidth: 'fit-content' }}>
        Sort by:
      </Typography>
      <FormControl size="small" sx={{ minWidth: isMobile ? 200 : 250 }}>
        <InputLabel id="sort-select-label">Sort Option</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sortBy}
          label="Sort Option"
          onChange={handleSortChange}
        >
          <MenuItem value="date-newest">Date (Newest First)</MenuItem>
          <MenuItem value="date-oldest">Date (Oldest First)</MenuItem>
          <MenuItem value="amount-highest">Amount (Highest First)</MenuItem>
          <MenuItem value="amount-lowest">Amount (Lowest First)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
