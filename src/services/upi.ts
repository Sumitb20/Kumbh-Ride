// Real UPI Payment Service for Kumbh Ride

const STORAGE_KEY = 'kumbh_upi_id';
export const DEFAULT_UPI_ID = 'sumitbhoyar2000-3@okicici';
export const DEFAULT_PAYEE_NAME = 'Sumit Bhoyar';

export function getReceiverUpiId(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  // Auto-migrate old typo with 03 if present in user's browser cache
  if (stored === 'sumitbhoyar2000-03@okicici') {
    localStorage.setItem(STORAGE_KEY, DEFAULT_UPI_ID);
    return DEFAULT_UPI_ID;
  }
  return stored || DEFAULT_UPI_ID;
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
 * Example: upi://pay?pa=sumitbhoyar2000-3@okicici&pn=Sumit%20Bhoyar&am=300&tn=Ride%20Booking&cu=INR
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
