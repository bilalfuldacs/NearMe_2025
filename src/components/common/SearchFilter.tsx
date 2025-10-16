import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  InputAdornment,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  KeyboardArrowDown as ArrowDownIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';
import { categoriesService, Category } from '../../services';

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onDateFilter?: (startDate: string, endDate: string) => void;
  onCategoryFilter?: (categoryId: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onDateFilter,
  onCategoryFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await categoriesService.getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setStartDate(value);
    onDateFilter?.(value, endDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEndDate(value);
    onDateFilter?.(startDate, value);
  };

  const handleCategoryChange = (event: any) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onCategoryFilter?.(value);
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
    onDateFilter?.('', '');
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
              placeholder="Search events by title, description, location, or category..."
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

          {/* Center - Date Range Filters */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              type="date"
              label="From Date"
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Events from..."
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                minWidth: '155px',
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
              }}
            />
            <TextField
              type="date"
              label="To Date"
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="Events until..."
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: startDate || undefined,
              }}
              sx={{
                minWidth: '155px',
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
              }}
            />
            {(startDate || endDate) && (
              <Tooltip title="Clear dates">
                <IconButton
                  size="small"
                  onClick={handleClearDates}
                  sx={{
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Right Side - Category Filter (aligned with notification icon) */}
          <FormControl sx={{ minWidth: '180px' }}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              displayEmpty
              disabled={loadingCategories}
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
              <MenuItem value="">
                {loadingCategories ? 'Loading...' : 'All Categories'}
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
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
