import React from 'react';
import { Box } from '@mui/material';
import Navbars from '../navbar/Navbar';
import SearchFilter from '../common/SearchFilter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleDateFilter = (date: string) => {
    console.log('Date filter:', date);
  };

  const handleCategoryFilter = (category: string) => {
    console.log('Category filter:', category);
  };

  return (
    <Box>
      <Navbars />
      <hr/>
      <SearchFilter 
        onSearch={handleSearch}
        onDateFilter={handleDateFilter}
        onCategoryFilter={handleCategoryFilter}
      />
      {children}
    </Box>
  );
};

export default Layout;
