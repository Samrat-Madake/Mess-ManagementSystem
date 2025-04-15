import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const createPayment = async (userId, userName, month, amount, receiptBase64) => {
  try {
    const paymentData = {
      userId,
      userName,
      month,
      amount: parseFloat(amount),
      receiptBase64,
      status: 'pending',
      submittedAt: Timestamp.now(),
      remarks: ''
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    return { id: docRef.id, ...paymentData };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to submit payment. Please try again.');
  }
};

export const getUserPayments = async (userId) => {
  try {
    // First try without ordering to see if it works
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const payments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort locally if server-side ordering fails
    return payments.sort((a, b) => b.submittedAt.seconds - a.submittedAt.seconds);
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw new Error('Failed to fetch payments. Please try again.');
  }
};

export const getAllPayments = async () => {
  try {
    const q = query(
      collection(db, 'payments'),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all payments:', error);
    throw new Error('Failed to fetch payments. Please try again.');
  }
};

export const updatePaymentStatus = async (paymentId, status, remarks = '') => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    await updateDoc(paymentRef, {
      status,
      remarks,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status. Please try again.');
  }
}; 