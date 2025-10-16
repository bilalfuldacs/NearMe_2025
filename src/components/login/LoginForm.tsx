import React, { useState, useContext } from 'react'
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Alert,
  useTheme,
  useMediaQuery,
  Link
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { InputField } from '../common/InputeField'
import LoginFormSvg from './LoginFormSvg'
import { loginValidationFunction } from '../common/validationFunction'
import type { Error } from '../signup/SignupForm'
import { AuthContext } from '../../auth/authContext'

export const LoginForm = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const authContext = useContext(AuthContext)
  const { login, loading: authLoading } = authContext || {}
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [validation, setValidation] = useState<Error>({})
  
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    // Clear errors when user types
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // Validate form
    const validationErrors = loginValidationFunction(loginData)
    setValidation(validationErrors)
    
    if (Object.keys(validationErrors).length === 0) {
      setError(null)
      setSuccess(null)
      
      try {
        if (!login) {
          throw new Error('Authentication context not available');
        }
        
        // Call login from context (which uses authService)
        await login({
          email: loginData.email,
          password: loginData.password
        });
        
        setSuccess('Login successful! Redirecting...');
        
        // PublicRoute will automatically redirect to home page
        
      } catch (error: any) {
        console.error('LoginForm: Login failed', error);
        
        // Display user-friendly error messages
        if (error.message?.includes('401')) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message?.includes('400')) {
          setError('Invalid credentials. Please check your email and password.');
        } else {
          setError(error.message || 'Login failed. Please try again.');
        }
      }
    } else {
    }
  }

  return (
    <Box sx={{ 
      
      py: { xs: 2, md: 4 },
      px: { xs: 2, md: 4 }
    }}>
        <Box sx={{ 
          display: 'flex', 
          height: '100%', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 4 },
          width: '100%'
        }}>
          {/* Left side - Image/SVG */}
          <Box 
            sx={{ 
              flex: 1,
              width: '50%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              padding: { xs: 2, md: 4 },
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Box sx={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <LoginFormSvg />
            </Box>
          </Box>
          
          {/* Right side - Form */}
          <Box 
            sx={{ 
              flex: 1,
              width: '50%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              padding: { xs: 2, md: 4 },
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              width: '100%',
              maxWidth: '500px'
            }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  textAlign="center" 
                  color="primary"
                  fontWeight="bold"
                  gutterBottom
                >
                  Welcome Back
                </Typography>
                
                <Typography 
                  variant="body2" 
                  textAlign="center" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Sign in to your account to continue
                </Typography>
                
                <InputField 
                  type="email" 
                  label="Email" 
                  value={loginData.email} 
                  onChange={handleChange('email')} 
                  placeholder="Enter your email"
                  error={!!validation.email}
                  helperText={validation.email}
                />
                
                <InputField 
                  type="password" 
                  label="Password" 
                  value={loginData.password} 
                  onChange={handleChange('password')} 
                  placeholder="Enter your password"
                  error={!!validation.password}
                  helperText={validation.password}
                />
                
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link 
                    href="#" 
                    variant="body2" 
                    color="primary"
                    sx={{ textDecoration: 'none' }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={authLoading}
                  sx={{ 
                    mt: 2, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  {authLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link 
                      component={RouterLink}
                      to="/signup"
                      color="primary"
                      sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
                
                {/* Success/Error Messages */}
                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
            </Box>
          </Box>
        </Box>
    </Box>
    )
}