import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbars from '../navbar/Navbar';
import SearchFilter from '../common/SearchFilter';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { setEvents, setLoading, setError } from '../../store/eventsSlice';
import { eventsService, EventFilters } from '../../services';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  // Hide search filter on messages page
  const showSearchFilter = location.pathname !== '/messages';

  // State for filters
  const [filters, setFilters] = useState<EventFilters>({});

  // Fetch events with filters
  const fetchFilteredEvents = useCallback(async (newFilters: EventFilters) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const events = await eventsService.getAllEvents(newFilters);
      dispatch(setEvents(events));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Layout: Error fetching filtered events:', err);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleSearch = (query: string) => {
    // Backend searches in: title, description, city, state, category__name
    const newFilters = { ...filters, search: query || undefined };
    setFilters(newFilters);
    fetchFilteredEvents(newFilters);
  };

  const handleDateFilter = (startDate: string, endDate: string) => {
    const newFilters = { 
      ...filters, 
      start_date: startDate || undefined,
      end_date: endDate || undefined
    };
    setFilters(newFilters);
    fetchFilteredEvents(newFilters);
  };

  const handleCategoryFilter = (categoryId: string) => {
    const newFilters = { ...filters, category: categoryId || undefined };
    setFilters(newFilters);
    fetchFilteredEvents(newFilters);
  };

  return (
    <Box>
      <Navbars />
      <hr/>
      {showSearchFilter && (
        <SearchFilter 
          onSearch={handleSearch}
          onDateFilter={handleDateFilter}
          onCategoryFilter={handleCategoryFilter}
        />
      )}
      {children}
    </Box>
  );
};

export default Layout;
