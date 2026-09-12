import React, { useState } from 'react';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';

export interface PayButtonProps {
  amount?: number | string;
  description?: string;
  items?: Array<{
    id?: string;
    name: string;
    price: number;
    quantity: number;
    grind?: string;
    weight?: string;
  }>;
  orderData?: any;
  metadata?: Record<string, any>;
  redirectUrl?: string;
  cancelUrl?: string;
  className?: string;
  buttonText?: string;
  disabled?: boolean;
  showIcon?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const PayButton: React.FC<PayButtonProps> = ({
  amount,
  description = 'Maison Milau Koffie & Producten',
  items,
  orderData,
  metadata,
  redirectUrl,
  cancelUrl,
  className = '',
  buttonText = 'Betaal nu',
  disabled = false,
  showIcon = true,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startPayment = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Determine origin for redirect/cancel URLs
      const origin = window.location.origin;
      const effectiveRedirect = redirectUrl || `${origin}/checkout?status=success`;
      const effectiveCancel = cancelUrl || `${origin}/checkout?status=cancelled`;

      const payload: any = {
        description,
        redirectUrl: effectiveRedirect,
        cancelUrl: effectiveCancel,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'PayButton',
          ...metadata,
        },
      };

      if (amount !== undefined && amount !== null) {
        payload.amount = typeof amount === 'number' ? amount : parseFloat(String(amount));
      }

      if (items && items.length > 0) {
        payload.items = items;
      }

      if (orderData) {
        Object.assign(payload, orderData);
      }

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success && !data.checkoutUrl) {
        const errMsg = data.error || data.detail || 'Kon geen betaling starten via Mollie.';
        throw new Error(errMsg);
      }

      if (data.checkoutUrl) {
        if (onSuccess) {
          onSuccess(data);
        }
        // Redirect browser directly to Mollie's hosted checkout page or local success route
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Geen geldige checkoutUrl ontvangen van Mollie server.');
      }
    } catch (err: any) {
      console.error('[PayButton Error]', err);
      const friendlyMsg = err.message || 'Er is een onverwachte fout opgetreden bij het starten van de betaling.';
      setErrorMessage(friendlyMsg);
      if (onError) {
        onError(friendlyMsg);
      } else {
        // Fallback user alert for immediate feedback if no inline handler is bound
        alert(friendlyMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <button
        type="button"
        id="btn-pay-now"
        onClick={startPayment}
        disabled={disabled || isProcessing}
        className={
          className ||
          'w-full bg-amber-900 hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors'
        }
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
            <span>Bezig met doorsturen naar Mollie...</span>
          </>
        ) : (
          <>
            {showIcon && <CreditCard className="w-4 h-4" />}
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PayButton;
