import React, { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { Grid } from '@mui/material';

interface ImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const EventCreationImages: React.FC<ImagePickerProps> = ({ images, onImagesChange }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              onImagesChange([...images, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    handleFileSelect(event.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{
      backgroundColor: 'white',
      borderRadius: 2,
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
        Event Images
      </Typography>

      {/* Upload Area */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        sx={{
          border: `2px dashed ${dragOver ? '#007bff' : '#ddd'}`,
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? '#f8f9ff' : '#fafafa',
          transition: 'all 0.3s ease',
          mb: 3,
          '&:hover': {
            borderColor: '#007bff',
            backgroundColor: '#f8f9ff'
          }
        }}
      >
        <CloudUpload sx={{ fontSize: 48, color: '#007bff', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {dragOver ? 'Drop images here' : 'Upload Images'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop images here, or click to select files
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Supports: JPG, PNG, GIF (Max 10MB each)
        </Typography>
      </Box>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Image Thumbnails */}
      {images.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selected Images ({images.length})
          </Typography>
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 1,
                    '&:hover .delete-button': {
                      opacity: 1
                    }
                  }}
                >
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <IconButton
                    className="delete-button"
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        color: 'error.main'
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Add More Button */}
      {images.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={openFileDialog}
            sx={{
              borderStyle: 'dashed',
              '&:hover': {
                borderStyle: 'dashed',
                backgroundColor: 'rgba(0, 123, 255, 0.04)'
              }
            }}
          >
            Add More Images
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EventCreationImages;
