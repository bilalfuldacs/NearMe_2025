import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  Avatar,
  Box,
  Tooltip,
  Paper,
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { AttendeeRequest } from '../../hooks/useEventAttendees';
import { getStatusColor, formatDateTime, getInitials } from '../../utils';

interface AttendeesListProps {
  attendees: AttendeeRequest[];
  onOpenChat: (attendee: AttendeeRequest) => void;
  loading?: boolean;
}

const AttendeesList: React.FC<AttendeesListProps> = ({
  attendees,
  onOpenChat,
  loading = false,
}) => {

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Requested</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Messages</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No attendance requests yet
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            attendees.map((attendee) => (
              <TableRow
                key={attendee.conversation_id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                          {getInitials(attendee.user_name)}
                        </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {attendee.user_name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {attendee.user_email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={attendee.status.toUpperCase()}
                    color={getStatusColor(attendee.status)}
                    size="small"
                    sx={{ fontWeight: 'bold', minWidth: 90 }}
                  />
                </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(attendee.request_date)}
                      </Typography>
                    </TableCell>
                <TableCell>
                  <Chip
                    label={attendee.message_count}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Open conversation">
                    <IconButton
                      color="primary"
                      onClick={() => onOpenChat(attendee)}
                      size="small"
                    >
                      <ChatIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendeesList;

