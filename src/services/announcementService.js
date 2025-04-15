import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

export const createAnnouncement = async (title, description) => {
  try {
    const docRef = await addDoc(collection(db, 'announcements'), {
      title,
      description,
      date: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting announcements:', error);
    throw error;
  }
}; 