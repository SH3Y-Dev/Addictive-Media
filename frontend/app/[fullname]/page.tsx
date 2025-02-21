'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation'; 
import axiosInstance from '../lib/axios';

const UserVideosPage = () => {
  const { fullname } = useParams();
  const searchParams = useSearchParams();
  const emailId = searchParams.get('emailId');

  const [videos, setVideos] = useState([]);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', dp: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (emailId) {
      const fetchUserVideos = async () => {
        try {
          const response = await axiosInstance.post('/video/user', {
            emailId: emailId,
          });
          const data = response.data;

          setProfile({
            firstName: data.firstName,
            lastName: data.lastName,
            dp: data.dp,
          });

          setVideos(data.videos);
        } catch (error) {
          console.error('Error fetching user videos:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserVideos();
    }
  }, [emailId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img
          src={profile.dp}
          alt={`${profile.firstName}'s profile`}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '20px',
          }}
        />
        <h2>{`${profile.firstName} ${profile.lastName}`}</h2>
      </div>

      <div style={{ padding: '20px', marginTop: '20px' }}>
        <h2>{`${profile.firstName}'s Videos`}</h2>
        {videos.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {videos.map((video:any, index) => (
              <div
                key={index}
                style={{
                  width: '200px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                <video
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  controls
                  preload="metadata"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <h4 style={{ fontSize: '14px', margin: '10px 0' }}>{video.title}</h4>

                <p style={{ fontSize: '12px', color: '#555' }}>{video.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No videos available.</p>
        )}
      </div>
    </div>
  );
};

export default UserVideosPage;
