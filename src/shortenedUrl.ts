import { Timestamp } from 'firebase/firestore';

export interface ShortenedUrl {
  originalUrl: string;
  shortenedUrl: string;
  createdAt: Timestamp;
  qrCode : string;
  clickCount : number;
  id: string;
  Name: string;
   // Use Firestore Timestamp type
}