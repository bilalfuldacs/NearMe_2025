import React from 'react';
import  {InputField}  from '../common/InputeField';
import { Box, Grid, Button } from '@mui/material';
import EventCreationAddress from './EventCreationAddress';
import EventCreationImages from './EventCreationImages';

interface EventCreationProps {
  eventData: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImagesChange: (images: string[]) => void;
  onSave: () => void;
  validation?: {[key: string]: string};
  isEditMode?: boolean;
  loading?: boolean;
}

const EventCreation: React.FC<EventCreationProps> = ({ 
  eventData, 
  handleInputChange, 
  onImagesChange, 
  onSave, 
  validation = {},
  isEditMode = false,
  loading = false
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <InputField 
        name="title" 
        label="Event Title" 
        type="text" 
        value={eventData.title} 
        onChange={handleInputChange} 
        placeholder="e.g., Dinner with Friends"
        error={!!validation.title}
        helperText={validation.title}
      />
      <InputField 
        name="description" 
        label="Description" 
        type="textarea" 
        value={eventData.description} 
        onChange={handleInputChange} 
        placeholder="Tell people what your event is about..."
        error={!!validation.description}
        helperText={validation.description}
      />
      <InputField 
        name="maxAttendance" 
        label="Max Attendance" 
        type="number" 
        value={eventData.maxAttendance} 
        onChange={handleInputChange} 
        placeholder="e.g., 5"
        error={!!validation.maxAttendance}
        helperText={validation.maxAttendance}
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
            error={!!validation.startDate}
            helperText={validation.startDate}
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
            error={!!validation.endDate}
            helperText={validation.endDate}
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
            error={!!validation.startTime}
            helperText={validation.startTime}
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
            error={!!validation.endTime}
            helperText={validation.endTime}
          />
        </Grid>
      </Grid>
      <EventCreationAddress eventData={eventData} handleInputChange={handleInputChange} validation={validation} />
      <EventCreationImages images={eventData.images} onImagesChange={onImagesChange} />
      
      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={onSave}
          disabled={loading}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Event' : 'Create Event')}
        </Button>
      </Box>
    </Box>
  );
};

export default EventCreation;