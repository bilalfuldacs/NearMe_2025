import React from 'react'
import { Box, Typography } from '@mui/material'
import {InputField} from '../common/InputeField'

const EventCreationAddress = ( {eventData, handleInputChange, validation = {}}: {eventData: any, handleInputChange: any, validation?: {[key: string]: string}}) => {
  return (
    <Box sx={{
      backgroundColor: 'grey.300',
      borderRadius: 4,
      p: 4,
      boxShadow: 1,
      mb: 3
    }}>
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          fontWeight: 'bold',
          color: 'text.primary',
          mb: 3
        }}
      >
        Event Location Details
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InputField 
          label="Address" 
          type="text" 
          value={eventData.street} 
          onChange={handleInputChange} 
          placeholder="Street name and number"
          name="street"
          error={!!validation.street}
          helperText={validation.street}
        />
        <InputField 
          label="City" 
          type="text" 
          value={eventData.city} 
          onChange={handleInputChange} 
          placeholder="e.g., San Francisco"
          name="city"
          error={!!validation.city}
          helperText={validation.city}
        />
        <InputField 
          label="State / Province" 
          type="text" 
          value={eventData.state} 
          onChange={handleInputChange} 
          placeholder="e.g., CA"
          name="state"
          error={!!validation.state}
          helperText={validation.state}
        />
        <InputField 
          label="Postal Code" 
          type="text" 
          value={eventData.zip} 
          onChange={handleInputChange} 
          placeholder="e.g., 94102"
          name="zip"
          error={!!validation.zip}
          helperText={validation.zip}
        />
      </Box>
    </Box>
  )
}

export default EventCreationAddress