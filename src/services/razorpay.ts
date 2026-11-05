// Razorpay Checkout Integration Service
// Uses Razorpay's client-side checkout.js for payment processing

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number; // in paise (₹1 = 100 paise)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

export interface CheckoutOptions {
  amount: number; // in INR (will be converted to paise)
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: Record<string, string>;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
  onDismiss?: () => void;
}

/**
 * Returns the Razorpay key — uses VITE env variable if available,
 * otherwise falls back to the hardcoded test key.
 */
export function getRazorpayKey(): string {
  return import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TwTutsSoPpoqzq';
}

/**
 * Loads the Razorpay checkout.js script dynamically if not already loaded.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') {
      resolve(true);
      return;
    }

    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      // Script tag exists but might still be loading
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      // If already loaded
      if (typeof window.Razorpay !== 'undefined') {
        resolve(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Opens the Razorpay checkout modal for payment.
 *
 * @param options - Checkout configuration
 */
export async function openRazorpayCheckout(options: CheckoutOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    options.onFailure('Failed to load Razorpay checkout. Please check your internet connection.');
    return;
  }

  const rzpOptions: RazorpayOptions = {
    key: getRazorpayKey(),
    amount: Math.round(options.amount * 100), // Convert INR to paise
    currency: 'INR',
    name: 'Kumbh Ride',
    description: options.description,
    image: './buildtek-logo.png',
    handler: (response: RazorpayResponse) => {
      options.onSuccess(response.razorpay_payment_id);
    },
    prefill: {
      name: options.customerName || '',
      email: options.customerEmail || '',
      contact: options.customerPhone || '',
    },
    notes: options.notes || {},
    theme: {
      color: '#F97316', // kumbh-orange
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
      escape: true,
      confirm_close: true,
    },
  };

  const rzp = new window.Razorpay(rzpOptions);

  rzp.on('payment.failed', (response: { error: { description: string } }) => {
    options.onFailure(response.error.description || 'Payment failed. Please try again.');
  });

  rzp.open();
}

