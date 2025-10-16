import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { AuthContext } from '../auth/authContext';
import { profileService, UserProfile } from '../services';
import { getInitials } from '../utils';

const ProfilePage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const updateUser = authContext?.updateUser;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Profile update states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Password change states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await profileService.getProfile();
        setProfile(profileData);
        setName(profileData.name);
        setEmail(profileData.email);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        // Use stored user data as fallback
        if (user) {
          setProfile(user as UserProfile);
          setName(user.name || '');
          setEmail(user.email || '');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      setUpdateError('Name and email are required');
      return;
    }

    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const result = await profileService.updateProfile({ name, email });
      
      setUpdateSuccess(result.message || 'Profile updated successfully!');
      setEditMode(false);
      
      // Update profile state
      if (result.user) {
        setProfile(result.user);
        // Update auth context
        if (updateUser) {
          updateUser(result.user);
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validation
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setChangingPassword(true);

    try {
      const result = await profileService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setPasswordSuccess(result.message || 'Password changed successfully!');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);

      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setName(profile?.name || '');
    setEmail(profile?.email || '');
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 4,
          }}
        >
          My Profile
        </Typography>

        {/* Profile Information */}
        <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          {/* Avatar and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold',
                mr: 3,
              }}
            >
              {getInitials(profile?.name || user?.name || 'U')}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {profile?.name || user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.email || user?.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Success/Error Messages */}
          {updateSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {updateSuccess}
            </Alert>
          )}
          {updateError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {updateError}
            </Alert>
          )}

          {/* Edit Mode Toggle */}
          {!editMode && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Edit Profile
              </Button>
            </Box>
          )}

          {/* Profile Fields */}
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color={editMode ? 'primary' : 'disabled'} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color={editMode ? 'primary' : 'disabled'} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Stack>

          {/* Edit Mode Actions */}
          {editMode && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
                disabled={updating}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={updating ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                onClick={handleUpdateProfile}
                disabled={updating}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Paper>

        {/* Change Password Section */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Security
          </Typography>

          {/* Success/Error Messages */}
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {passwordSuccess}
            </Alert>
          )}
          {passwordError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {passwordError}
            </Alert>
          )}

          {!showPasswordSection ? (
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setShowPasswordSection(true)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Change Password
            </Button>
          ) : (
            <Box>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Minimum 8 characters"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError(null);
                  }}
                  disabled={changingPassword}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={changingPassword ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Account Info */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Account Information
          </Typography>
          <Stack spacing={2}>
            {profile?.username && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1">
                  {profile.username}
                </Typography>
              </Box>
            )}
            {profile?.created_at && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;

