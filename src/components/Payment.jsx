import React from 'react';
import { useAuth } from '../context/AuthContext';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function Payment({ amount, packageName, onSuccess }) {
  const { user } = useAuth();

  async function displayRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    // Replace with your actual Razorpay key_id
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID',
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Mess Management',
      description: `Payment for ${packageName}`,
      handler: function (response) {
        // Handle successful payment
        onSuccess(response);
      },
      prefill: {
        email: user.email,
        name: user.email.split('@')[0],
      },
      theme: {
        color: '#3B82F6', // Blue color matching your UI
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <button
      onClick={displayRazorpay}
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Pay ₹{amount}
    </button>
  );
}

export default Payment; 