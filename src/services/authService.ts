import api from './api';
import { User } from '../types';

export const loginUser = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  try {
    // Create form data for token endpoint
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Get token
    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;

    // Get user profile
    const user = await getUserProfile(access_token);

    return {
      token: access_token,
      user,
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Login failed');
    }
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get user profile');
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  fullName?: string
): Promise<User> => {
  try {
    const response = await api.post('/users/', {
      username,
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Registration failed');
    }
    throw new Error('Registration failed. Please try again.');
  }
};