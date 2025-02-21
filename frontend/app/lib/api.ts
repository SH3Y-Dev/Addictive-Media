import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
}

interface UserLogin {
  email: string;
  password: string;
}

export const registerUser = async (userData: UserRegistration): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const loginUser = async (credentials: UserLogin): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
