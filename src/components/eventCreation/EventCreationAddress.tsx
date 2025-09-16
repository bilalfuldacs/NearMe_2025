import React from 'react'
import { Box, Typography } from '@mui/material'
import {InputField} from '../common/InputeField'

const EventCreationAddress = ( {eventData, handleInputChange}: {eventData: any, handleInputChange: any}) => {
    console.log(eventData)
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
        />
        <InputField 
          label="City" 
          type="text" 
          value={eventData.city} 
          onChange={handleInputChange} 
          placeholder="e.g., San Francisco"
          name="city"
        />
        <InputField 
          label="State / Province" 
          type="text" 
          value={eventData.state} 
          onChange={handleInputChange} 
          placeholder="e.g., CA"
          name="state"
        />
        <InputField 
          label="Postal Code" 
          type="text" 
          value={eventData.zip} 
          onChange={handleInputChange} 
          placeholder="e.g., 94102"
          name="zip"
        />
      </Box>
    </Box>
  )
}

export default EventCreationAddress