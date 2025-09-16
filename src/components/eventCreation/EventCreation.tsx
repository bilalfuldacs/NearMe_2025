import React from 'react';
import  {InputField}  from '../common/InputeField';
import { Box, Grid } from '@mui/material';
import EventCreationAddress from './EventCreationAddress';
import EventCreationImages from './EventCreationImages';

interface EventCreationProps {
  eventData: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImagesChange: (images: string[]) => void;
}

const EventCreation: React.FC<EventCreationProps> = ({ eventData, handleInputChange, onImagesChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <InputField 
        name="title" 
        label="Event Title" 
        type="text" 
        value={eventData.title} 
        onChange={handleInputChange} 
        placeholder="e.g., Dinner with Friends" 
      />
      <InputField 
        name="description" 
        label="Description" 
        type="textarea" 
        value={eventData.description} 
        onChange={handleInputChange} 
        placeholder="Tell people what your event is about..." 
      />
      {/* Date and Time Section - Two Columns */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 6 }}>
          <InputField 
            name="startDate" 
            label="Start Date" 
            type="date" 
            value={eventData.startDate} 
            onChange={handleInputChange} 
            placeholder="Select start date"
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <InputField 
            name="endDate" 
            label="End Date" 
            type="date" 
            value={eventData.endDate} 
            onChange={handleInputChange} 
            placeholder="Select end date"
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 6 }}>
          <InputField 
            name="startTime" 
            label="Start Time" 
            type="time" 
            value={eventData.startTime} 
            onChange={handleInputChange} 
            placeholder="Select start time"
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <InputField 
            name="endTime" 
            label="End Time" 
            type="time" 
            value={eventData.endTime} 
            onChange={handleInputChange} 
            placeholder="Select end time"
          />
        </Grid>
      </Grid>
      <EventCreationAddress eventData={eventData} handleInputChange={handleInputChange} />
      <EventCreationImages images={eventData.images} onImagesChange={onImagesChange} />
    </Box>
  );
};

export default EventCreation;