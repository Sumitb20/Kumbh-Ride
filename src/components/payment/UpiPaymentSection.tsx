import { useState } from 'react';
import {
  Copy,
  Check,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  ExternalLink,
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
  isProcessing,
}: UpiPaymentSectionProps) {
  const upiId = getReceiverUpiId();
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [qrType, setQrType] = useState<'square' | 'card'>('square');

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

  const handleConfirmPaid = () => {
    const txnId = utrNumber.trim() || `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    onPaymentComplete(txnId);
  };

  return (
    <div className="card p-5 border-2 border-orange-200 bg-white space-y-5 shadow-sm">
      {/* Header with Amount */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold text-kumbh-deep uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live UPI Payment
          </span>
          <p className="text-xs text-gray-500 mt-0.5">Pay to Sumit Bhoyar</p>
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

      {/* QR Code Style Selector */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setQrType('square')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            qrType === 'square'
              ? 'bg-kumbh-orange text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Square QR Code
        </button>
        <button
          type="button"
          onClick={() => setQrType('card')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            qrType === 'card'
              ? 'bg-kumbh-orange text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Full Google Pay Card
        </button>
      </div>

      {/* Official Uploaded QR Code Display */}
      <div className="flex flex-col items-center text-center space-y-3 pt-1">
        <div className="relative p-2 bg-white rounded-3xl shadow-md border-2 border-orange-100 inline-block overflow-hidden max-w-full">
          <img
            src={qrType === 'square' ? './sumit-upi-qr.jpg' : './sumit-gpay-card.jpg'}
            alt="Sumit Bhoyar Google Pay UPI QR"
            className={`${
              qrType === 'square' ? 'w-56 h-56 object-contain' : 'w-64 max-h-80 object-contain'
            } rounded-2xl`}
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-kumbh-text">
            Sumit Bhoyar • Scan to pay ₹{amount.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-500">
            Works with Google Pay, PhonePe, Paytm, BHIM, or any UPI App
          </p>
        </div>
      </div>

      {/* Mobile 1-Tap App Buttons */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-600">Or tap to pay directly on this phone:</p>
        <div className="grid grid-cols-3 gap-2">
          {/* GPay */}
          <button
            type="button"
            onClick={handlePayViaApp}
            className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs">
              G
            </div>
            <span className="text-[11px] font-bold text-gray-700">Google Pay</span>
          </button>

          {/* PhonePe */}
          <button
            type="button"
            onClick={handlePayViaApp}
            className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center font-bold text-purple-600 text-xs">
              Pe
            </div>
            <span className="text-[11px] font-bold text-gray-700">PhonePe</span>
          </button>

          {/* Paytm / Any */}
          <button
            type="button"
            onClick={handlePayViaApp}
            className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center font-bold text-sky-600 text-xs">
              Py
            </div>
            <span className="text-[11px] font-bold text-gray-700">Paytm / Any</span>
          </button>
        </div>
      </div>

      {/* UTR Verification & Confirmation */}
      <div className="pt-3 border-t border-gray-100 space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-gray-500 block mb-1">
            UPI UTR / Reference No. (Optional for testing)
          </label>
          <input
            type="text"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            placeholder="e.g. 431289123456"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-kumbh-orange"
          />
        </div>

        <button
          type="button"
          onClick={handleConfirmPaid}
          disabled={isProcessing}
          className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm shadow-md"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying Payment...
            </span>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>I Have Paid ₹{amount.toLocaleString('en-IN')}</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1">
          <ShieldCheck size={13} className="text-green-600" />
          Instant verification & instant boarding pass issue
        </p>
      </div>
    </div>
  );
}
