import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbars from '../navbar/Navbar';
import SearchFilter from '../common/SearchFilter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Hide search filter on messages page
  const showSearchFilter = location.pathname !== '/messages';

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
  };

  const handleDateFilter = (date: string) => {
    // TODO: Implement date filter functionality
  };

  const handleCategoryFilter = (category: string) => {
    // TODO: Implement category filter functionality
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
