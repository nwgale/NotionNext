// pages/sync-admin.js
import { useState } from 'react';
import { useGlobal } from '@/lib/global';

const SyncAdminPage = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useGlobal();

  const handleSync = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(locale.SYNC_ADMIN.SUCCESS);
        setPassword(''); // 清空密码
      } else {
        setMessage(`${locale.SYNC_ADMIN.ERROR}: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`${locale.SYNC_ADMIN.ERROR}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>{locale.SYNC_ADMIN.TITLE}</h1>
      <p style={{ color: '#666' }}>{locale.SYNC_ADMIN.DESCRIPTION}</p>
      
      <div style={{ margin: '30px 0' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={locale.SYNC_ADMIN.PASSWORD_PLACEHOLDER}
          disabled={isLoading}
          style={{ padding: '10px', width: '80%', maxWidth: '300px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <button
        onClick={handleSync}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          backgroundColor: isLoading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? locale.SYNC_ADMIN.SYNCING : locale.SYNC_ADMIN.SYNC_BUTTON}
      </button>

      {message && (
        <p style={{ marginTop: '20px', color: message.includes(locale.SYNC_ADMIN.ERROR) ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SyncAdminPage;