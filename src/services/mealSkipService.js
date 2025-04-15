import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, Timestamp } from 'firebase/firestore';

// Create a new meal skip request
export const createMealSkip = async (userId, userName, date, skipLunch, skipDinner) => {
  try {
    // Ensure all required fields are present and of the correct type
    if (!userId || !userName || !date || typeof skipLunch !== 'boolean' || typeof skipDinner !== 'boolean') {
      throw new Error('Missing or invalid required fields');
    }

    const mealSkipRef = await addDoc(collection(db, 'mealSkips'), {
      userId,
      userName,
      date: Timestamp.fromDate(new Date(date)),
      skipLunch,
      skipDinner,
      createdAt: Timestamp.now(),
      status: 'pending'
    });
    return mealSkipRef.id;
  } catch (error) {
    console.error('Error creating meal skip:', error);
    throw error;
  }
};

// Get all meal skips for a specific user
export const getUserMealSkips = async (userId) => {
  try {
    const q = query(
      collection(db, 'mealSkips'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user meal skips:', error);
    throw error;
  }
};

// Get all meal skips (for admin)
export const getAllMealSkips = async () => {
  try {
    const q = query(
      collection(db, 'mealSkips'),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all meal skips:', error);
    throw error;
  }
};

// Update meal skip status
export const updateMealSkipStatus = async (mealSkipId, status) => {
  try {
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status value');
    }

    const mealSkipRef = doc(db, 'mealSkips', mealSkipId);
    await updateDoc(mealSkipRef, {
      status
    });
  } catch (error) {
    console.error('Error updating meal skip status:', error);
    throw error;
  }
}; 