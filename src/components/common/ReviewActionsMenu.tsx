import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface ReviewActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ReviewActionsMenu: React.FC<ReviewActionsMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onEdit,
  onDelete
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={onEdit}>
        <EditIcon fontSize="small" sx={{ mr: 1 }} />
        Edit Review
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
        Delete Review
      </MenuItem>
    </Menu>
  );
};

export const ReviewActionsButton: React.FC<{
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ onClick }) => {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      sx={{
        color: 'text.secondary',
        '&:hover': {
          color: 'text.primary',
          bgcolor: 'action.hover'
        }
      }}
    >
      <MoreVertIcon fontSize="small" />
    </IconButton>
  );
};

export default ReviewActionsMenu;
