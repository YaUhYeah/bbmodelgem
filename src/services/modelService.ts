import api from './api';
import { BBModel, BBModelResponse } from '../types';

export const generateModel = async (
  prompt: string,
  modelType: string = 'character',
  animationType?: string
): Promise<BBModelResponse> => {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('model_type', modelType);
    
    if (animationType) {
      formData.append('animation_type', animationType);
    }

    const response = await api.post('/models/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Model generation failed');
    }
    throw new Error('Failed to generate model. Please try again.');
  }
};

export const getModelStatus = async (modelId: string): Promise<BBModelResponse> => {
  try {
    const response = await api.get(`/models/status/${modelId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to get model status');
    }
    throw new Error('Failed to get model status. Please try again.');
  }
};

export const getUserModels = async (skip: number = 0, limit: number = 10): Promise<BBModel[]> => {
  try {
    const response = await api.get(`/models/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to get models');
    }
    throw new Error('Failed to get models. Please try again.');
  }
};

export const downloadModel = async (modelId: string): Promise<Blob> => {
  try {
    const response = await api.get(`/models/${modelId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to download model');
    }
    throw new Error('Failed to download model. Please try again.');
  }
};