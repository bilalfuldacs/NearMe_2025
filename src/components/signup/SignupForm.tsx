import React, { useState } from 'react'
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
import SignUpFormSvg from './SignUpFormSvg'
import { validationFunction } from '../common/validationFunction'
import useApiHook from '../hookes/useApiHook'

export interface Error {
    [key: string]: string
}

export const SignupForm = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { data, loading, error, fetchData } = useApiHook()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [validation, setValidation] = useState<Error>({})
  
  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Form submitted with data:', formData)
    
    const validation = validationFunction(formData)
    setValidation(validation)
    console.log('Validation result:', validation)
    
    if (Object.keys(validation).length === 0) {
      console.log('Sending data to backend...')
      await fetchData('http://localhost:8000/api/create/', formData)
    } else {
      console.log('Validation failed, not sending data')
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
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
              <SignUpFormSvg />
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
                  Sign Up
                </Typography>
                
                <Typography 
                  variant="body2" 
                  textAlign="center" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Create your account to get started
                </Typography>
                
                <InputField 
                  type="text" 
                  label="Name" 
                  value={formData.name} 
                  onChange={handleInputChange('name')} 
                  placeholder="Enter your full name"
                  error={!!validation.name}
                  helperText={validation.name}
                />
                
                <InputField 
                  type="email" 
                  label="Email" 
                  value={formData.email} 
                  onChange={handleInputChange('email')} 
                  placeholder="Enter your email"
                  error={!!validation.email}
                  helperText={validation.email}
                />
                
                <InputField 
                  type="password" 
                  label="Password" 
                  value={formData.password} 
                  onChange={handleInputChange('password')} 
                  placeholder="Enter your password"
                  error={!!validation.password}
                  helperText={validation.password}
                />
                
                <InputField 
                  type="password" 
                  label="Confirm Password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange('confirmPassword')} 
                  placeholder="Confirm your password"
                  error={!!validation.confirmPassword}
                  helperText={validation.confirmPassword}
                />
                
               
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={loading}
                  onClick={() => console.log('Sign Up button clicked')}
                  sx={{ 
                    mt: 2, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link 
                      component={RouterLink}
                      to="/login"
                      color="primary"
                      sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
                
                {/* Success/Error Messages */}
                {data && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Signup successful! Welcome aboard! 🎉
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Signup failed. Please try again.
                  </Alert>
                )}
              </Box>
            
          </Box>
        </Box>

    </Box>
  )
}