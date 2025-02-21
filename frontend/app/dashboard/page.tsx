'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';
import VideoUpload from './video';

export default function Dashboard() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    dp: '',
    bio: '',
    videos: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [isUpdatingBio, setIsUpdatingBio] = useState(false);
  const [isUpdatingDp, setIsUpdatingDp] = useState(false);
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/user/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenModal = (isBio: boolean) => {
    setIsUpdatingBio(isBio);
    setIsUpdatingDp(!isBio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBio('');
    setFile(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUpdatingBio && !bio) {
      setError('Please provide a bio.');
      return;
    }

    if (isUpdatingBio && bio.length > 500) {
      setError('Bio cannot exceed 500 characters.');
      return;
    }

    if (isUpdatingDp && !file) {
      setError('Please select a profile picture.');
      return;
    }

    const formData = new FormData();
    if (isUpdatingBio) {
      formData.append('bio', bio);
    }
    if (isUpdatingDp && file) {
      formData.append('dp', file);
    }

    try {
      const response = await axiosInstance.post('/user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedProfile = response.data;
      setProfile((prevProfile) => ({
        ...prevProfile,
        bio: bio,
        dp: updatedProfile.dp || prevProfile.dp,
      }));
      if (isUpdatingDp) {
        fetchProfile();
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    
    <div>
      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: '1', textAlign: 'center' }}>
            {profile.dp ? (
              <img
                src={profile.dp}
                alt="Profile"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            ) : (
              <button onClick={() => handleOpenModal(false)}>Add Profile Picture</button>
            )}
          </div>

          <div style={{ flex: '2', textAlign: 'center', margin: '0 20px' }}>
            <p><strong>First Name:</strong> {profile.firstName}</p>
            <p><strong>Last Name:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone Number:</strong> {profile.number}</p>
          </div>

          <div style={{ flex: '1', textAlign: 'center' }}>
            {profile.bio ? (
              <p><strong>Bio:</strong> {profile.bio}</p>
            ) : (
              <button onClick={() => handleOpenModal(true)}>Add Bio</button>
            )}
          </div>
        </div>

        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '20px',
              border: '1px solid #ccc',
              zIndex: 1000,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '400px',
              borderRadius: '8px',
            }}
          >
            <h2>{isUpdatingBio ? 'Update Bio' : 'Update Profile Picture'}</h2>
            <form onSubmit={handleSubmit}>
              {isUpdatingBio && (
                <div style={{ marginBottom: '10px' }}>
                  <label>Bio (max 500 characters)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={500}
                    style={{
                      width: '100%',
                      height: '100px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '10px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              )}
              {isUpdatingDp && (
                <div style={{ marginBottom: '10px' }}>
                  <label>Upload Profile Picture (500x500, max 1MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    style={{
                      border: '1px solid #ccc',
                      padding: '10px',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              )}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    marginLeft: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={handleCloseModal}
          />
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <VideoUpload />
      </div>

      <div style={{ padding: '20px', marginTop: '30px' }}>
  <h2>Your Videos</h2>
  {profile.videos.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {profile.videos.map((video: any, index: number) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex' }}>
          <div style={{ flex: '1', marginRight: '10px' }}>
            <video
              width="100%"
              height="150px"
              style={{ objectFit: 'cover', borderRadius: '8px' }}
              controls
              preload="metadata"
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div style={{ flex: '2', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '10px' }}>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No videos available.</p>
  )}
</div>





      
    </div>
  );
}
