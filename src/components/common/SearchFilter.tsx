import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  InputAdornment,
  Divider
} from '@mui/material';
import { Search as SearchIcon, KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onDateFilter?: (date: string) => void;
  onCategoryFilter?: (category: string) => void;
}

const categories = [
  'Any Category',
  'Technology',
  'Business',
  'Education',
  'Entertainment',
  'Sports',
  'Health',
  'Food & Drink',
  'Art & Culture',
  'Networking'
];

const dateOptions = [
  'Date',
  'Today',
  'Tomorrow',
  'This Week',
  'Next Week',
  'This Month',
  'Next Month',
  'Custom Range'
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onDateFilter,
  onCategoryFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('Date');
  const [selectedCategory, setSelectedCategory] = useState('Any Category');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleDateChange = (event: any) => {
    const value = event.target.value;
    setSelectedDate(value);
    onDateFilter?.(value);
  };

  const handleCategoryChange = (event: any) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onCategoryFilter?.(value);
  };

  return (
    <Box sx={{ 
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      py: 2,
      px: 4,
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 3,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          width: '100%',
          justifyContent: 'space-between'
        }}>
          {/* Left Side - Search Bar */}
          <Box sx={{ flex: 1, maxWidth: '700px' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                  height: '48px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#007bff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#007bff',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  fontSize: '1rem',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Center - Date Filter */}
          <FormControl sx={{ minWidth: '180px' }}>
            <Select
              value={selectedDate}
              onChange={handleDateChange}
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                height: '48px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007bff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007bff',
                },
                '& .MuiSelect-select': {
                  py: 1.5,
                  fontSize: '1rem',
                }
              }}
              IconComponent={ArrowDownIcon}
            >
              {dateOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Right Side - Category Filter (aligned with notification icon) */}
          <FormControl sx={{ minWidth: '180px' }}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                height: '48px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007bff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#007bff',
                },
                '& .MuiSelect-select': {
                  py: 1.5,
                  fontSize: '1rem',
                }
              }}
              IconComponent={ArrowDownIcon}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchFilter;
