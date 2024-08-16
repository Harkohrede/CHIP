import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { ShortenedUrl } from '../shortenedUrl';
import { Timestamp } from 'firebase/firestore';
import './links.css'; // Keep the existing CSS file import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const UserLinks: React.FC = () => {
  const [links, setLinks] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userShortenedUrlsRef = collection(
        db,
        'users',
        user.uid,
        'LinkDATAS',
      );
      const unsubscribe = onSnapshot(
        userShortenedUrlsRef,
        (snapshot) => {
          const linksData: ShortenedUrl[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id, // Store document ID for deletion
              Name: data.Name as string,
              originalUrl: data.LongUrl as string,
              shortenedUrl: data.shortUrl as string,
              createdAt: data.createdAt as Timestamp,
              qrCode: data.qrCode as string,
              clickCount: data.clickCount as number,
            };
          });
          setLinks(linksData);
          setLoading(false);
        },
        (error) => {
          setError('Error fetching links: ' + error.message);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } else {
      setError('No user is signed in.');
      setLoading(false);
    }
  }, []);

  const handleDelete = async (linkId: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const linkRef = doc(db, 'users', user.uid, 'LinkDATAS', linkId);
        await deleteDoc(linkRef);
        setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId));
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleDownload = (qrCodeUrl: string) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png'; // Set default file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (shortenedUrl: string) => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopiedUrl(shortenedUrl);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const navigate = useNavigate();
  const handleDash = () => {
    navigate('/dashboard');
  };
  const handleAnalytics = () => {
    navigate('/Analytics');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="links-container">
      <nav>
        <button onClick={handleDash}>Dashboard</button>
        <button onClick={handleAnalytics}>Analytics</button>
      </nav>
      <h2>Your Shortened Links</h2>
      {links.length > 0 ? (
        <ul>
          {links.map((link) => (
            <li key={link.id} className="link-card">
              <div className="link-card-content">
                <div className="link-card-actions">
                  <button
                    onClick={() => handleDownload(link.qrCode)}
                    className="download-button"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="delete-button"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="link-details">
                  <p>
                    <strong>Name:</strong> {link.Name}
                  </p>
                  <p>
                    <strong>Original URL:</strong>{' '}
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.originalUrl}
                    </a>
                  </p>
                  <p>
                    <strong>Shortened URL:</strong>{' '}
                    <a
                      href={link.shortenedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.shortenedUrl}
                    </a>
                    <button
                      onClick={() => handleCopy(link.shortenedUrl)}
                      className="copy-button"
                    >
                      {copiedUrl === link.shortenedUrl ? (
                        'Copied!'
                      ) : (
                        <FontAwesomeIcon icon={faCopy} />
                      )}
                    </button>
                  </p>
                  <p>
                    <strong>Created At:</strong>{' '}
                    {link.createdAt.toDate().toLocaleString()}
                  </p>
                  <p>
                    <strong>Click Count:</strong> {link.clickCount}
                  </p>
                </div>
              </div>
              <div className="qr-code-container">
                <img src={link.qrCode} alt="QR Code" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-links">No links found.</p>
      )}
    </div>
  );
};

export default UserLinks;
