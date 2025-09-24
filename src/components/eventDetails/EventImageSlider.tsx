import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon
} from '@mui/icons-material';

interface EventImageSliderProps {
  images: Array<{
    id: number;
    url: string;
    caption: string;
    is_primary: boolean;
    uploaded_at: string;
  }>;
  onBack: () => void;
}

const EventImageSlider: React.FC<EventImageSliderProps> = ({
  images,
  onBack
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <Box sx={{ 
        height: isMobile ? '300px' : '400px',
        backgroundColor: 'grey.200',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <IconButton onClick={onBack} sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
            ←
          </IconButton>
        </Box>
        <Typography variant="h6" color="text.secondary">
          No images available
        </Typography>
      </Box>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      {/* Back Button */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
        <IconButton 
          onClick={onBack}
          sx={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)'
            }
          }}
        >
          ←
        </IconButton>
      </Box>

      {/* Main Image */}
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        overflow: 'hidden'
      }}>
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Event image ${currentImageIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 16,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            zIndex: 2
          }}>
            <Chip 
              label={`${currentImageIndex + 1} / ${images.length}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white'
              }}
            />
          </Box>
        )}
      </Box>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          p: 2,
          backgroundColor: 'grey.50',
          overflowX: 'auto'
        }}>
          {images.map((image, index) => (
            <Box
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                width: 80,
                height: 60,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: currentImageIndex === index ? '3px solid' : '1px solid',
                borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                opacity: currentImageIndex === index ? 1 : 0.7,
                transition: 'all 0.2s',
                flexShrink: 0,
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.05)'
                }
              }}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventImageSlider;
