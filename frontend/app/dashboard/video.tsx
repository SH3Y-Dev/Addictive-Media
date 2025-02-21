import { useState } from 'react';
import axiosInstance from '../lib/axios';

export default function VideoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !file) {
      setError('Please provide title, description, and video file.');
      return;
    }

    if (title.length > 30) {
      setError('Title cannot exceed 30 words.');
      return;
    }

    if (description.length > 120) {
      setError('Description cannot exceed 120 words.');
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError('Video size should be less than 6MB.');
      return;
    }

    if (file.type !== 'video/mp4') {
      setError('Only MP4 videos are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    setIsUploading(true);

    try {
      const response = await axiosInstance.post('/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setError('');
        setTitle('');
        setDescription('');
        setFile(null);
        alert('Video uploaded successfully!');
      } else {
        setError('Video upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Error uploading video:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Video</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
          onClick={() => document.getElementById('uploadVideoModal')?.classList.remove('hidden')}
          style={{
            padding: '10px',
            background: '#007bff',
            color: 'white',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>Upload Video</span>
          <span style={{ marginLeft: '8px', fontSize: '20px' }}>+</span>
        </button>
      </div>

      <div
        id="uploadVideoModal"
        className="hidden"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          padding: '20px',
          border: '1px solid #ccc',
          zIndex: 1000,
          width: '400px',
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#000' }}>Upload Your Video</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '15px', color:'#000' }}>
            <label htmlFor="title" >Title (max 30 words)</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={30}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px', color:'#000' }}>
            <label htmlFor="description">Description (max 120 words)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px',
                height: '80px',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px', color:'#000' }}>
            <label htmlFor="file">Video File (MP4, max 6MB)</label>
            <input
              id="file"
              type="file"
              accept="video/mp4"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              style={{ marginTop: '5px' }}
            />
          </div>

          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="submit" disabled={isUploading} style={{ padding: '10px 15px', color:'#000' }}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('uploadVideoModal')?.classList.add('hidden')}
              style={{ marginLeft: '10px', padding: '10px 15px', background: '#ccc' }}
            >
              Cancel
            </button>
          </div>

          {isUploading && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <p>Uploading, please wait...</p>
            </div>
          )}
        </form>
      </div>

      <div
        className="hidden"
        id="modalOverlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
      />
    </div>
  );
}
