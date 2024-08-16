//shorten.tsx
import React, { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import QRCode from 'qrcode';
import { db } from '../firebaseConfig';
import { nanoid } from 'nanoid';
import { auth } from '../firebaseConfig';
import './shorten.css'

const ShortenUrl = () => {
  const [customUrl, setCustomUrl] = useState('');
  const [Name, setName] = useState('');
  const [LongUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const Id = customUrl || nanoid(6);
        const shortUrl = `http://localhost:5173/${Id}`;
        const qrCodeUrl = await QRCode.toDataURL(shortUrl);
        const userShortenedUrlsRef = collection(
          db,
          'users',
          user.uid,
          'LinkDATAS',
        );
        const newUrlRef = doc(userShortenedUrlsRef, Id);

        const publicUrlsRef = collection(db, 'LinkDATAS');
      const newPublicUrlRef = doc(publicUrlsRef, Id);

        if (customUrl) {
          const customUrlDoc = await getDoc(
            doc(userShortenedUrlsRef, customUrl),
          );
          if (customUrlDoc.exists()) {
            throw new Error('This Custom URL Already Exist. Choose A New One');
          }
        }
        const linkData = {
          Name,
          Id,
          LongUrl,
          shortUrl,
          qrCode: qrCodeUrl,
          clickCount: 0,
          createdAt: serverTimestamp(),
          userId: userId, 
        }
        await setDoc(newUrlRef, linkData);
        await setDoc(newPublicUrlRef,linkData);

        setName('');
        setLongUrl('');
        setCustomUrl('');
        setShortUrl(shortUrl);
        setQrCodeDataUrl(qrCodeUrl);
        //window.location.reload();
      }
    } catch (error) {
      console.error('Error generating short URL:', error);
    }
  };

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name of URL"
        />
        <input
          type="text"
          value={LongUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter URL to shorten"
        />
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Enter a custom URl (optional)"
        />
        <button type="submit" onClick={handleSubmit}>Shorten URL</button>
      </form>
    </div>
  );
};

export default ShortenUrl;
