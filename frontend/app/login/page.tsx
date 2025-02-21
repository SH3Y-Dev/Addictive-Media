'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed'); 
        return;
      }
    
      const data = await response.json();
      
      localStorage.setItem('access_token', data.access_token);
    
      router.push('/dashboard');
    } catch (err) {
      console.error('Error during login:', err);
      setError('An unexpected error occurred.');
    }
    
    
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      width: '300px',
      padding: '2rem',
      backgroundColor: '#000',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    input: {
      marginBottom: '1rem',
      padding: '0.8rem',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      color: '#000'
    },
    button: {
      padding: '0.8rem',
      fontSize: '1rem',
      color: '#fff',
      backgroundColor: '#0070f3',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      marginBottom: '1rem',
    },
    link: {
      marginTop: '10px',
      textAlign: 'center' as 'center',
    },
    linkText: {
      color: '#007bff',
      textDecoration: 'none',
    },
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {/* Link to the register page */}
      <p style={styles.link}>
        Don't have an account? <Link href="/register" style={styles.linkText}>Register here</Link>
      </p>
    </div>
  );
  
}


