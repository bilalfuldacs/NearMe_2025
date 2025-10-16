import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { AuthContext } from '../auth/authContext';
import { useEventAttendees, AttendeeRequest } from '../hooks/useEventAttendees';
import { conversationsService } from '../services/conversationsService';
import AttendeesList from '../components/eventDetails/AttendeesList';
import SendRequestDialog from '../components/eventDetails/SendRequestDialog';

const ManageAttendeesPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const { attendees, eventInfo, loading, error } = useEventAttendees({
    eventId: eventId ? parseInt(eventId) : null,
  });

  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeRequest | null>(null);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>('');

  const handleBack = () => {
    navigate(`/event/${eventId}`);
  };

  const handleOpenChat = (attendee: AttendeeRequest) => {
    setSelectedAttendee(attendee);
    setSelectedEventTitle(eventInfo?.title || 'Event');
    setChatDialogOpen(true);
  };

  const handleCloseChat = () => {
    setChatDialogOpen(false);
    setSelectedAttendee(null);
  };

  const getStats = () => {
    const pending = attendees.filter(a => a.status === 'pending').length;
    const confirmed = attendees.filter(a => a.status === 'confirmed').length;
    const rejected = attendees.filter(a => a.status === 'rejected').length;
    return { pending, confirmed, rejected, total: attendees.length };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Back to Event
          </Button>
          
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Manage Attendees
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and manage attendance requests for your event
          </Typography>
        </Box>

        {/* Event Info & Stats Cards */}
        {eventInfo && (
          <Paper sx={{ p: 3, mb: 3, backgroundColor: 'primary.light' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {eventInfo.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box>
                <Typography variant="body2" color="text.secondary">
                  Confirmed Attendees
                </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {eventInfo.confirmed_attendees}
                    </Typography>
              </Box>
              <Box>
                    <Typography variant="body2" color="text.secondary">
                  Available Spots
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {eventInfo.available_spots}
                    </Typography>
                  </Box>
                </Box>
          </Paper>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Paper sx={{ p: 2, flex: 1, minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Requests
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.total}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Pending
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
              {stats.pending}
                    </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                      Confirmed
                    </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {stats.confirmed}
                    </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                      Rejected
                    </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              {stats.rejected}
            </Typography>
          </Paper>
                </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Attendees Table */}
        <AttendeesList
          attendees={attendees}
          onOpenChat={handleOpenChat}
          loading={loading}
        />
      </Container>

      {/* Chat Dialog */}
      {selectedAttendee && eventId && (
        <SendRequestDialog
          open={chatDialogOpen}
          onClose={handleCloseChat}
          onSubmit={async () => {}}
          onSendMessage={async (eventId, message) => {
            await conversationsService.sendMessage(eventId, message);
          }}
          onCheckConversation={async (checkEventId) => {
            // Fetch actual conversation messages from API
            const result = await conversationsService.getConversationMessages(selectedAttendee.conversation_id);
            
            // Transform to match expected ConversationDetail type
            const conversationDetail: any = {
              id: result.conversation.id,
              status: result.conversation.status as 'pending' | 'confirmed' | 'rejected',
              created_at: selectedAttendee.request_date,
              updated_at: selectedAttendee.request_date,
              confirmed_at: null,
              rejected_at: null,
              event: {
                id: result.conversation.event.id,
                title: result.conversation.event.title,
                description: result.conversation.event.description,
                start_date: result.conversation.event.start_date,
                end_date: result.conversation.event.start_date,
                start_time: '00:00:00',
                end_time: '23:59:00',
                city: result.conversation.event.city,
                state: result.conversation.event.state,
                max_attendees: 0,
                confirmed_attendees: 0,
                is_full: false,
              },
              user: result.conversation.user,
              host: result.conversation.host,
              message_count: result.conversation.message_count,
            };
            
            return {
              exists: true,
              conversation: conversationDetail,
              messages: result.messages,
            };
          }}
          eventTitle={selectedEventTitle}
          organizerName={user?.name || 'You'}
          eventId={parseInt(eventId)}
          currentUserEmail={user?.email || ''}
          isHost={true}
        />
      )}
    </Box>
  );
};

export default ManageAttendeesPage;

