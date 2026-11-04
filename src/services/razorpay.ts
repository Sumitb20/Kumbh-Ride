declare global {
  interface Window {
    Razorpay?: any;
  }
}

const STORAGE_KEY = 'kumbh_razorpay_key';

// Default Razorpay Test Key (users can replace with their own rzp_test_... in app or .env)
export const DEFAULT_TEST_KEY =
  import.meta.env.VITE_RAZORPAY_KEY_ID ||
  localStorage.getItem(STORAGE_KEY) ||
  'rzp_test_1DP5mmOlF5G5ag'; // Public sandbox demo key

export function getRazorpayKey(): string {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_TEST_KEY;
}

export function setRazorpayKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export interface RazorpayOptions {
  amount: number; // in INR
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
  onDismiss?: () => void;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(options: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    options.onFailure(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
    return;
  }

  const key = getRazorpayKey();

  const rzpOptions = {
    key,
    amount: Math.round(options.amount * 100), // Razorpay takes amount in paise
    currency: 'INR',
    name: 'कुंभ Ride',
    description: options.description,
    image: 'https://sumitb20.github.io/Kumbh-Ride/icon-192.png',
    handler: function (response: { razorpay_payment_id: string }) {
      if (response && response.razorpay_payment_id) {
        options.onSuccess(response.razorpay_payment_id);
      } else {
        options.onFailure(new Error('No payment ID returned by Razorpay'));
      }
    },
    prefill: {
      name: options.customerName,
      contact: options.customerPhone.replace(/[^0-9]/g, '').slice(-10),
      email: options.customerEmail || 'yatri@kumbhride.in',
    },
    notes: {
      platform: 'Kumbh Ride PWA',
      event: 'Nashik Kumbh Mela 2028',
    },
    theme: {
      color: '#F97316',
      backdrop_color: 'rgba(0, 0, 0, 0.65)',
    },
    modal: {
      ondismiss: function () {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
  };

  try {
    const rzp = new window.Razorpay(rzpOptions);
    rzp.on('payment.failed', function (response: any) {
      options.onFailure(response.error);
    });
    rzp.open();
  } catch (err) {
    options.onFailure(err);
  }
}

