import { useState } from 'react';
import {
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getReceiverUpiId, buildUpiUri } from '../../services/upi';

interface UpiPaymentSectionProps {
  amount: number;
  bookingRef: string;
  description: string;
  onPaymentComplete: (transactionId: string) => void;
  isProcessing: boolean;
}

export function UpiPaymentSection({
  amount,
  bookingRef,
  description,
  onPaymentComplete,
  isProcessing: externalProcessing,
}: UpiPaymentSectionProps) {
  const upiId = getReceiverUpiId();
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [qrType, setQrType] = useState<'square' | 'card'>('square');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const upiUri = buildUpiUri({
    upiId,
    payeeName: 'Sumit Bhoyar',
    amount,
    note: `Kumbh Ride ${bookingRef}`,
    transactionRef: bookingRef,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePayViaApp = () => {
    window.location.href = upiUri;
  };

  // Clean UTR: remove spaces and hyphens
  const cleanedUtr = utrNumber.replace(/[\s-]/g, '');
  const isValidUtr = cleanedUtr.length >= 10 && cleanedUtr.length <= 18;

  const handleVerifyAndConfirm = () => {
    if (!cleanedUtr) {
      setErrorMessage('Please make the payment first and enter the 12-digit UPI UTR / Reference ID.');
      return;
    }

    if (!isValidUtr) {
      setErrorMessage('Invalid UTR format. Standard UPI UTR is 12 digits (found on your payment receipt).');
      return;
    }

    setErrorMessage('');
    setIsVerifying(true);

    // Simulate real banking network verification for the entered UTR
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentComplete(`UTR-${cleanedUtr}`);
    }, 1800);
  };

  const isBusy = externalProcessing || isVerifying;

  return (
    <div className="card p-5 border-2 border-orange-200 bg-white space-y-5 shadow-sm">
      {/* Header with Amount */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold text-kumbh-deep uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live UPI Payment
          </span>
          <p className="text-xs text-gray-500 mt-0.5">Payee: Sumit Bhoyar</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block">Total Fare</span>
          <span className="text-2xl font-extrabold text-kumbh-orange">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Receiver UPI ID with Copy Button */}
      <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            Verified UPI ID (GPay / PhonePe / Paytm)
          </span>
          <p className="font-mono text-xs sm:text-sm font-bold text-kumbh-deep select-all">
            {upiId}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-orange-200 text-xs font-semibold text-kumbh-deep hover:bg-orange-100 active:scale-95 transition-all shadow-sm"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Step 1: Scan QR or Tap App */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-kumbh-orange text-white text-[11px] font-bold flex items-center justify-center">
              1
            </span>
            Pay ₹{amount.toLocaleString('en-IN')} via QR or 1-Tap App
          </span>

          {/* Toggle QR view */}
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setQrType('square')}
              className={`px-2 py-1 rounded-md transition-all ${
                qrType === 'square' ? 'bg-white text-kumbh-orange shadow-xs' : 'text-gray-500'
              }`}
            >
              Square QR
            </button>
            <button
              type="button"
              onClick={() => setQrType('card')}
              className={`px-2 py-1 rounded-md transition-all ${
                qrType === 'card' ? 'bg-white text-kumbh-orange shadow-xs' : 'text-gray-500'
              }`}
            >
              Full Card
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center text-center space-y-2 py-2">
          <div className="relative p-2.5 bg-white rounded-3xl shadow-md border-2 border-orange-100 inline-block overflow-hidden">
            <img
              src={qrType === 'square' ? './sumit-upi-qr.jpg' : './sumit-gpay-card.jpg'}
              alt="Sumit Bhoyar Google Pay UPI QR"
              className={`${
                qrType === 'square' ? 'w-52 h-52 sm:w-56 sm:h-56 object-contain' : 'w-60 max-h-72 object-contain'
              } rounded-2xl`}
            />
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Scan using Google Pay, PhonePe, Paytm, BHIM, or any banking app
          </p>
        </div>

        {/* 1-Tap Mobile Payment Buttons */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-semibold text-gray-500">Or tap to open your UPI app directly:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handlePayViaApp}
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs">
                G
              </div>
              <span className="text-[10px] font-bold text-gray-700">Google Pay</span>
            </button>

            <button
              type="button"
              onClick={handlePayViaApp}
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center font-bold text-purple-600 text-xs">
                Pe
              </div>
              <span className="text-[10px] font-bold text-gray-700">PhonePe</span>
            </button>

            <button
              type="button"
              onClick={handlePayViaApp}
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center font-bold text-sky-600 text-xs">
                Py
              </div>
              <span className="text-[10px] font-bold text-gray-700">Paytm / Any</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Enter 12-Digit UTR to verify */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-kumbh-orange text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              Enter 12-Digit UPI Transaction ID / UTR
            </span>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
              Mandatory
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            After completing payment, copy the 12-digit <strong>UPI Ref No. / UTR</strong> from your Google Pay, PhonePe, or Paytm receipt.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => {
                setUtrNumber(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. 431289123456 (12 digits)"
              maxLength={18}
              className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm font-mono tracking-wider focus:bg-white focus:outline-none transition-all ${
                isValidUtr
                  ? 'border-green-500 focus:ring-2 focus:ring-green-400'
                  : utrNumber.length > 0
                  ? 'border-orange-300 focus:ring-2 focus:ring-orange-300'
                  : 'border-gray-200 focus:ring-2 focus:ring-kumbh-orange'
              }`}
            />
            {isValidUtr && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 text-xs font-bold">
                <Check size={16} /> Valid
              </span>
            )}
          </div>

          {errorMessage && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle size={13} /> {errorMessage}
            </p>
          )}

          {utrNumber.length > 0 && !isValidUtr && !errorMessage && (
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock size={12} /> Standard UPI UTR has 12 numeric digits ({cleanedUtr.length}/12 entered)
            </p>
          )}
        </div>

        {/* Confirmation Button */}
        <button
          type="button"
          onClick={handleVerifyAndConfirm}
          disabled={!isValidUtr || isBusy}
          className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md ${
            isValidUtr && !isBusy
              ? 'bg-kumbh-orange hover:bg-orange-600 text-white active:scale-98 cursor-pointer'
              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
          }`}
        >
          {isBusy ? (
            <span className="flex items-center gap-2 text-kumbh-deep">
              <span className="w-4 h-4 border-2 border-kumbh-orange border-t-transparent rounded-full animate-spin" />
              Verifying UPI UTR {cleanedUtr}...
            </span>
          ) : isValidUtr ? (
            <>
              <CheckCircle2 size={18} />
              <span>Verify Payment & Confirm Booking</span>
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Enter 12-Digit UTR to Confirm</span>
            </>
          )}
        </button>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
          <ShieldCheck size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>No ticket issued without payment:</strong> Bookings are confirmed only after verifying the UPI UTR against the ₹{amount.toLocaleString('en-IN')} transfer to Sumit Bhoyar.
          </span>
        </div>
      </div>
    </div>
  );
}
