import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import ShortenUrl from './Shorten';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate('/'); // Redirect to home page after signing out
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };
  const handleLinks = () => {
    navigate('/Links');
  };
  const handleAnalytics = () => {
    navigate('/Analytics');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
      </header>
      {user ? (
        <div className="dashboard-content">
          <div className="welcome-message">
            <p>
              Welcome,{' '}
              <span className="user-name">{user.displayName || 'User'}</span>!
            </p>
            <p>Email: {user.email}</p>
            <p>
              Account Created:{' '}
              {new Date(user.metadata.creationTime || '').toLocaleDateString()}
            </p>
          </div>
          <div className="button-group">
            <button className="btn btn-primary" onClick={handleLinks}>
              My Links
            </button>
            <button className="btn btn-secondary" onClick={handleAnalytics}>
              Analytics
            </button>
            <button className="btn btn-danger" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
          <div className="short">
            <ShortenUrl />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
