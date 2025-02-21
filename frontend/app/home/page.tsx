'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { useRouter } from 'next/navigation';

interface Video {
  title: string;
  description: string;
  videoPath: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  emailId : string;
  dp: string;
  videos: Video[];
}

const Home = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const router = useRouter();

  const fetchLatestVideos = async () => {
    try {
      const response = await axiosInstance.get('/video/latest'); 
      setProfiles(response.data); 
    } catch (err) {
      console.error('Error fetching latest videos:', err);
    }
  };

  useEffect(() => {
    fetchLatestVideos();
  }, []);

  const handleProfileClick = (fn: string, ln: string, emailId: string) => {
    const fullName = `${fn}${ln}`;
    router.push(`/${fullName}?emailId=${emailId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      {profiles.length > 0 ? (
        profiles.map((profile, profileIndex) => (
          <div key={profileIndex} style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={profile.dp}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '10px',
                }}
              />
              <h3
                onClick={() => handleProfileClick(profile.firstName, profile.lastName, profile.emailId)}
                style={{ cursor: 'pointer', color: '#007bff' }}
              >
                {`${profile.firstName} ${profile.lastName}`}
              </h3>
            </div>

            <div style={{ padding: '20px', marginTop: '30px' }}>
              <h2>Your Videos</h2>
              {profile.videos.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {profile.videos.map((video, index) => (
                    <div
                      key={index}
                      style={{
                        width: '150px',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '10px',
                      }}
                    >
                      <video
                        style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                        controls
                        preload="metadata"
                      >
                        <source src={video.videoPath} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      <h4 style={{ fontSize: '12px', margin: '5px 0' }}>{video.title}</h4>
                      <p style={{ fontSize: '10px', color: '#555' }}>{video.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No videos available.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No videos available.</p>
      )}
    </div>
  );
};

export default Home;
