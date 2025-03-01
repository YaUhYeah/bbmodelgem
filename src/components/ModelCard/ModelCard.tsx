import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { BBModel } from '../../types';
import { downloadModel } from '../../services/modelService';

interface ModelCardProps {
  model: BBModel;
  onDelete?: (modelId: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onDelete }) => {
  const handleDownload = async () => {
    try {
      const blob = await downloadModel(model.id);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model.name}.bbmodel`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download model:', error);
      alert('Failed to download model. Please try again.');
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this model?')) {
      onDelete(model.id);
    }
  };

  // Format the date
  const formattedDate = new Date(model.created_at).toLocaleDateString();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        height: 200, 
        backgroundColor: '#f0f0f0', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {model.preview_url ? (
          <img 
            src={model.preview_url} 
            alt={model.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#e0e0e0'
          }}>
            <Typography variant="body2" color="text.secondary">
              No preview available
            </Typography>
          </Box>
        )}
        
        {/* Status chip */}
        <Chip
          label={model.status}
          color={model.status === 'completed' ? 'success' : model.status === 'processing' ? 'warning' : 'error'}
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8,
            textTransform: 'capitalize'
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {model.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Created: {formattedDate}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          mb: 2
        }}>
          {model.prompt}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title="View Model">
            <IconButton 
              component={RouterLink} 
              to={`/models/${model.id}`}
              aria-label="view"
              size="small"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Edit Model">
            <IconButton 
              component={RouterLink} 
              to={`/models/${model.id}/edit`}
              aria-label="edit"
              size="small"
              sx={{ ml: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box>
          {model.status === 'completed' && (
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
          )}
          
          {onDelete && (
            <Tooltip title="Delete Model">
              <IconButton 
                onClick={handleDelete}
                aria-label="delete"
                size="small"
                color="error"
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ModelCard;