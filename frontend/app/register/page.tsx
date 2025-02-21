'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
    const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(formData);
    
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL +'/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed'); 
        return; 
      }

      setSuccess('Registration successful!');
      
      setFormData({ 
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      });
      router.push('/login');
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Register</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="firstName" style={styles.label}  >First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="lastName" style={styles.label}>Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="phoneNumber" style={styles.label}>Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    color:'#000'
  },
  header: {
    textAlign: 'center' as 'center',
    marginBottom: '20px',
    color:'#000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    color:'#000'
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '5px',
    color: '#000',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  },
  successMessage: {
    color: 'green',
    marginBottom: '10px',
    fontSize: '14px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#005bb5',
  },
};
