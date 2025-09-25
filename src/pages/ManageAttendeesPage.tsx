import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { 
  Message, 
  ArrowBack,
  Person,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material';
import { AuthContext } from '../auth/authContext';

// Interface for conversation data (from event conversations endpoint)
interface EventConversation {
  id: number;
  event: number;
  event_title: string;
  user: number;
  user_name: string;
  user_email?: string;
  host: number;
  host_name: string;
  status: string; // "pending", "confirmed", "rejected"
  created_at: string;
  updated_at: string;
  last_message?: {
    id: number;
    text: string;
    sender_name: string;
    created_at: string;
  };
  message_count: number;
}

const ManageAttendeesPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [conversations, setConversations] = useState<EventConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations for the event
  useEffect(() => {
    if (eventId) {
      fetchEventConversations();
    }
  }, [eventId]);

  const fetchEventConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/api/conversations/event/${eventId}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched event conversations:', data);
      
      const conversationsData = data.conversations || data || [];
      setConversations(conversationsData);
    } catch (err) {
      console.error('Error fetching event conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch event conversations');
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async (conversationId: number, newStatus: string) => {
    try {
      setLoading(true);
      
      // Update conversation status
      const response = await fetch(`http://localhost:8000/api/conversations/${conversationId}/status/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Status updated:', result);

      // Update local state
      setConversations(prev => prev.map(conversation => 
        conversation.id === conversationId 
          ? { ...conversation, status: newStatus }
          : conversation
      ));

    } catch (err) {
      console.error('Error updating status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleChatRedirect = (conversationId: number) => {
    navigate(`/messages?conversation=${conversationId}`);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'rejected':
        return <Cancel />;
      case 'pending':
      default:
        return <Pending />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back to Event
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Manage Attendees
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            View and manage all users who have requested to join this event
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid sx={{ sm: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {conversations.filter(c => c.status === 'pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                  <Pending color="action" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid sx={{ sm: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {conversations.filter(c => c.status === 'confirmed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confirmed
                    </Typography>
                  </Box>
                  <CheckCircle color="success" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid sx={{ sm: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {conversations.filter(c => c.status === 'rejected').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rejected
                    </Typography>
                  </Box>
                  <Cancel color="error" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Attendees Table */}
        {!loading && !error && (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <TableRow key={conversation.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ backgroundColor: '#1976d2' }}>
                            {conversation.user_name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {conversation.user_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {conversation.user_email || 'No email provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(conversation.status)}
                          label={conversation.status}
                          color={getStatusColor(conversation.status) as any}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(conversation.created_at)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {/* Chat Button */}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Message />}
                            onClick={() => handleChatRedirect(conversation.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            Chat
                          </Button>
                          
                          {/* Status Update Buttons - Only show for pending */}
                          {conversation.status === 'pending' && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleStatusUpdate(conversation.id, 'confirmed')}
                                disabled={loading}
                                sx={{ textTransform: 'none' }}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleStatusUpdate(conversation.id, 'rejected')}
                                disabled={loading}
                                sx={{ textTransform: 'none' }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                      <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No conversations yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        When people request to join your event, their conversations will appear here.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default ManageAttendeesPage;
