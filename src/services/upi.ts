// Real UPI Payment Service for Kumbh Ride

const STORAGE_KEY = 'kumbh_upi_id';
const DEFAULT_UPI_ID = 'sumitbhoyar2000-03@okicici';
const DEFAULT_PAYEE_NAME = 'Kumbh Ride (Sumit Bhoyar)';

export function getReceiverUpiId(): string {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_UPI_ID;
}

export function setReceiverUpiId(id: string): void {
  if (id.trim()) {
    localStorage.setItem(STORAGE_KEY, id.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export interface UpiPaymentDetails {
  upiId?: string;
  payeeName?: string;
  amount: number;
  note: string;
  transactionRef?: string;
}

/**
 * Standard NPCI UPI URI Scheme
 * Example: upi://pay?pa=sumitbhoyar2000-03@okicici&pn=Kumbh%20Ride&am=300&tn=Ride%20Booking&cu=INR
 */
export function buildUpiUri(details: UpiPaymentDetails): string {
  const pa = details.upiId || getReceiverUpiId();
  const pn = encodeURIComponent(details.payeeName || DEFAULT_PAYEE_NAME);
  const am = details.amount.toFixed(2);
  const tn = encodeURIComponent(details.note || 'Kumbh Ride Pilgrimage Booking');
  const tr = details.transactionRef ? `&tr=${encodeURIComponent(details.transactionRef)}` : '';

  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tn=${tn}&cu=INR${tr}`;
}

/**
 * Specific app intent triggers for Android / iOS
 */
export function buildGPayIntent(details: UpiPaymentDetails): string {
  return buildUpiUri(details);
}

export function buildPhonePeIntent(details: UpiPaymentDetails): string {
  return buildUpiUri(details);
}

export function buildPaytmIntent(details: UpiPaymentDetails): string {
  return buildUpiUri(details);
}

