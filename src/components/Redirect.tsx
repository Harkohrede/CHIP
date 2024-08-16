// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebaseConfig';
// import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// const Redirect: React.FC = () => {
//   const { id } = useParams<{ id: string }>();

//   useEffect(() => {
//     const fetchLongUrl = async () => {
//       try {
//         // Reference the public LinkDATAS document
//         const publicDocRef = doc(db, 'LinkDATAS', id);
//         const publicDocSnap = await getDoc(publicDocRef);

//         if (publicDocSnap.exists()) {
//           const data = publicDocSnap.data();
//           const longUrl = data?.LongUrl;
//           const userId = data?.userId;  // Assuming you're storing the userId in the LinkDATAS document

//           // Increment click count in the LinkDATAS collection
//           await updateDoc(publicDocRef, {
//             clickCount: increment(1),
//           });

//           console.log('LinkDATAS clickCount incremented successfully.');

//           // Increment click count in the user's collection
//           if (userId) {
//             const userDocRef = doc(db, 'users', userId, 'LinkDATAS', id);
//             await updateDoc(userDocRef, {
//               clickCount: increment(1),
//             });
//             console.log('User collection clickCount incremented successfully.');
//           }

//           // Log the click event with a timestamp in analytics subcollection
//           const analyticsRef = collection(db, 'LinkDATAS', id, 'analyticsData');
//           await addDoc(analyticsRef, {
//             timestamp: serverTimestamp(),
//           });
//           console.log('Click event logged in analytics subcollection.');

//           // Redirect to the long URL
//           if (longUrl) {
//             window.location.href = longUrl;
//           } else {
//             console.error('Long URL not found');
//           }
//         } else {
//           console.error('No such document!');
//         }
//       } catch (error) {
//         console.error('Error fetching URL:', error);
//       }
//     };

//     fetchLongUrl();
//   }, [id]);

//   return null;
// };

// export default Redirect;
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Redirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchLongUrl = async () => {
      try {
        if (!id) {
          console.error('ID is undefined');
          return;
        }

        // Reference the public LinkDATAS document
        const publicDocRef = doc(db, 'LinkDATAS', id);
        const publicDocSnap = await getDoc(publicDocRef);

        if (publicDocSnap.exists()) {
          const data = publicDocSnap.data();
          const longUrl = data?.LongUrl;
          const userId = data?.userId;  // Ensure this field is present in LinkDATAS

          if (!userId) {
            console.error('userId is undefined');
            return;
          }

          // Increment click count in the LinkDATAS collection
          await updateDoc(publicDocRef, {
            clickCount: increment(1),
          });
          console.log('LinkDATAS clickCount incremented successfully.');

          // Increment click count in the user's collection
          const userDocRef = doc(db, 'users', userId, 'LinkDATAS', id);
          await updateDoc(userDocRef, {
            clickCount: increment(1),
          });
          console.log('User collection clickCount incremented successfully.');

          // Log the click event with a timestamp in analytics subcollection
          const analyticsRef = collection(db, 'LinkDATAS', id, 'analyticsData');
          await addDoc(analyticsRef, {
            timestamp: serverTimestamp(),
          });
          console.log('Click event logged in analytics subcollection.');

          // Redirect to the long URL
          if (longUrl) {
            window.location.href = longUrl;
          } else {
            console.error('Long URL not found');
          }
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching URL:', error);
      }
    };

    fetchLongUrl();
  }, [id]);

  return null;
};

export default Redirect;
