import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserModels } from '../services/modelService';
import { BBModel } from '../types';
import Layout from '../components/Layout/Layout';
import ModelCard from '../components/ModelCard/ModelCard';

const DashboardPage: React.FC = () => {
  const [models, setModels] = useState<BBModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModels, setFilteredModels] = useState<BBModel[]>([]);
  
  const ITEMS_PER_PAGE = 6;

  // Fetch user models
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getUserModels(0, 100); // Get all models, we'll handle pagination client-side
        setModels(data);
        setFilteredModels(data);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  // Filter models when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredModels(models);
      setTotalPages(Math.ceil(models.length / ITEMS_PER_PAGE));
    } else {
      const filtered = models.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredModels(filtered);
      setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
      setPage(1); // Reset to first page when filtering
    }
  }, [searchQuery, models]);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Handle model deletion
  const handleDeleteModel = (modelId: string) => {
    // In a real app, this would call an API to delete the model
    // For now, we'll just remove it from the local state
    setModels(prevModels => prevModels.filter(model => model.id !== modelId));
    setFilteredModels(prevModels => prevModels.filter(model => model.id !== modelId));
  };

  // Get current page models
  const getCurrentPageModels = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredModels.slice(startIndex, endIndex);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Models
          </Typography>
          
          <Button
            component={RouterLink}
            to="/create"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Create New Model
          </Button>
        </Box>
        
        {/* Search and filter */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search models by name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredModels.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No models found
            </Typography>
            {searchQuery ? (
              <Typography variant="body1" color="text.secondary">
                Try a different search term or clear the search
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You haven't created any models yet
                </Typography>
                <Button
                  component={RouterLink}
                  to="/create"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Create Your First Model
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {getCurrentPageModels().map((model) => (
                <Grid item key={model.id} xs={12} sm={6} md={4}>
                  <ModelCard model={model} onDelete={handleDeleteModel} />
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default DashboardPage;