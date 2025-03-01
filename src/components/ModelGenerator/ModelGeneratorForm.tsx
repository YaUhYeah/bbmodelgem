import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  CircularProgress,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { generateModel } from '../../services/modelService';
import { BBModelResponse } from '../../types';

interface ModelGeneratorFormProps {
  onModelGenerated: (modelResponse: BBModelResponse) => void;
}

const ModelGeneratorForm: React.FC<ModelGeneratorFormProps> = ({ onModelGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    prompt: Yup.string()
      .required('Prompt is required')
      .min(10, 'Prompt should be at least 10 characters')
      .max(500, 'Prompt should not exceed 500 characters'),
    modelType: Yup.string().required('Model type is required'),
    animationType: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      prompt: '',
      modelType: 'character',
      animationType: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await generateModel(
          values.prompt,
          values.modelType,
          values.animationType || undefined
        );
        
        onModelGenerated(response);
      } catch (err: any) {
        setError(err.message || 'Failed to generate model');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Generate bbmodel
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Describe the 3D model you want to create in detail. The AI will generate a bbmodel file compatible with Blockbench.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          id="prompt"
          name="prompt"
          label="Prompt"
          multiline
          rows={4}
          placeholder="Describe your model in detail (e.g., A blocky robot character with red armor, blue eyes, and mechanical arms...)"
          value={formik.values.prompt}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.prompt && Boolean(formik.errors.prompt)}
          helperText={formik.touched.prompt && formik.errors.prompt}
          sx={{ mb: 3 }}
        />
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="model-type-label">Model Type</InputLabel>
          <Select
            labelId="model-type-label"
            id="modelType"
            name="modelType"
            value={formik.values.modelType}
            label="Model Type"
            onChange={formik.handleChange}
          >
            <MenuItem value="character">Character</MenuItem>
            <MenuItem value="animal">Animal</MenuItem>
            <MenuItem value="vehicle">Vehicle</MenuItem>
            <MenuItem value="prop">Prop</MenuItem>
            <MenuItem value="environment">Environment</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="animation-type-label">Animation Type (Optional)</InputLabel>
          <Select
            labelId="animation-type-label"
            id="animationType"
            name="animationType"
            value={formik.values.animationType}
            label="Animation Type (Optional)"
            onChange={formik.handleChange}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="walk">Walking</MenuItem>
            <MenuItem value="idle">Idle</MenuItem>
            <MenuItem value="attack">Attack</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {loading ? 'Generating...' : 'Generate Model'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ModelGeneratorForm;