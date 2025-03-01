import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: 2,
          mb: 6,
          backgroundImage: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            AI-Powered bbmodel Generator
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Create stunning 3D models for Blockbench with the power of AI.
            Just describe what you want, and our AI will generate a complete bbmodel with textures and animations.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/create"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2, px: 4, py: 1.5, fontWeight: 'bold' }}
            >
              Create a Model
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Key Features
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h1" color="primary">🤖</Typography>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    AI-Powered Generation
                  </Typography>
                  <Typography>
                    Our advanced AI understands your descriptions and generates detailed 3D models
                    with proper structure, proportions, and details.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h1" color="primary">🎬</Typography>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    Automatic Animations
                  </Typography>
                  <Typography>
                    Choose from various animation types or describe custom animations.
                    The AI will rig and animate your model automatically.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h1" color="primary">🎨</Typography>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    Texture Generation
                  </Typography>
                  <Typography>
                    AI-generated textures that match your description, with proper UV mapping
                    ready for use in Blockbench.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 6, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            How It Works
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  1. Describe Your Vision
                </Typography>
                <Typography paragraph>
                  Enter a detailed description of the 3D model you want to create.
                  The more details you provide, the better the results.
                </Typography>

                <Typography variant="h5" gutterBottom>
                  2. Choose Options
                </Typography>
                <Typography paragraph>
                  Select the model type and animation style that best fits your needs.
                </Typography>

                <Typography variant="h5" gutterBottom>
                  3. Generate & Download
                </Typography>
                <Typography paragraph>
                  Our AI will process your request and generate a complete bbmodel file
                  that you can download and open directly in Blockbench.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#e0e0e0',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  [Interactive Demo Placeholder]
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to create amazing 3D models?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join thousands of creators who are already using our AI-powered bbmodel generator.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;