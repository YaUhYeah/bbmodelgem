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
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getModelStatus } from '../services/modelService';
import { BBModelResponse } from '../types';
import Layout from '../components/Layout/Layout';
import ModelGeneratorForm from '../components/ModelGenerator/ModelGeneratorForm';
import ModelViewer from '../components/ModelViewer/ModelViewer';

const steps = ['Enter Details', 'Generate Model', 'Review & Download'];

const CreateModelPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [modelResponse, setModelResponse] = useState<BBModelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Handle model generation
  const handleModelGenerated = (response: BBModelResponse) => {
    setModelResponse(response);
    setActiveStep(1);
    
    // Start polling for status updates
    const interval = setInterval(async () => {
      try {
        const status = await getModelStatus(response.model_id);
        setModelResponse(status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          
          if (status.status === 'completed') {
            setActiveStep(2);
          } else {
            setError(`Model generation failed: ${status.message}`);
          }
        }
      } catch (err: any) {
        clearInterval(interval);
        setPollingInterval(null);
        setError(err.message || 'Failed to get model status');
      }
    }, 2000);
    
    setPollingInterval(interval);
  };

  // Handle download
  const handleDownload = () => {
    if (modelResponse?.download_url) {
      window.location.href = modelResponse.download_url;
    }
  };

  // Navigate to dashboard
  const handleViewAllModels = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Model
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={activeStep === 0 ? 12 : 6}>
            {activeStep === 0 ? (
              <ModelGeneratorForm onModelGenerated={handleModelGenerated} />
            ) : (
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Generation Status
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {modelResponse?.status}
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    <strong>Model ID:</strong> {modelResponse?.model_id}
                  </Typography>
                  
                  {modelResponse?.message && (
                    <Typography variant="body1" gutterBottom>
                      <strong>Message:</strong> {modelResponse.message}
                    </Typography>
                  )}
                </Box>
                
                {activeStep === 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    <Typography>
                      Processing your request... This may take a minute.
                    </Typography>
                  </Box>
                )}
                
                {activeStep === 2 && (
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDownload}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Download bbmodel
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={handleViewAllModels}
                      fullWidth
                    >
                      View All Models
                    </Button>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>
          
          {activeStep > 0 && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Preview
                </Typography>
                
                <ModelViewer previewUrl={modelResponse?.preview_url} />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default CreateModelPage;