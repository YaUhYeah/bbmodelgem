import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getUserModels, downloadModel } from '../services/modelService';
import { BBModel } from '../types';
import Layout from '../components/Layout/Layout';
import ModelViewer from '../components/ModelViewer/ModelViewer';

const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<BBModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch model details
  useEffect(() => {
    const fetchModel = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, you'd have a dedicated API endpoint to get a single model
        // For now, we'll fetch all models and find the one we need
        const models = await getUserModels();
        const foundModel = models.find(m => m.id === id);
        
        if (foundModel) {
          setModel(foundModel);
        } else {
          setError('Model not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch model details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModel();
  }, [id]);

  // Handle download
  const handleDownload = async () => {
    if (!model) return;
    
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

  // Format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            component={RouterLink}
            to="/dashboard"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : model ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                  {model.name}
                </Typography>
                
                <Box>
                  <Chip
                    label={model.status}
                    color={model.status === 'completed' ? 'success' : model.status === 'processing' ? 'warning' : 'error'}
                    sx={{ mr: 2, textTransform: 'capitalize' }}
                  />
                  
                  <Button
                    component={RouterLink}
                    to={`/models/${model.id}/edit`}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ mr: 2 }}
                  >
                    Edit
                  </Button>
                  
                  {model.status === 'completed' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                    >
                      Download
                    </Button>
                  )}
                </Box>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Paper elevation={3} sx={{ p: 0, overflow: 'hidden', borderRadius: 2, mb: 4 }}>
                    <Box sx={{ height: 500 }}>
                      <ModelViewer previewUrl={model.preview_url} />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Model Details
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(model.created_at)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {model.status}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Model ID
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                        {model.id}
                      </Typography>
                    </Box>
                  </Paper>
                  
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Prompt
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body1">
                      {model.prompt}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            <Alert severity="info">
              Model not found
            </Alert>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default ModelDetailPage;