import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, PromotionCoupon } from '../types';
import { useStock, AvailabilityInfo } from './StockContext';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (
    productId: string,
    variantWeight: string,
    grind: string,
    delta: number,
    selectedColor?: string,
    selectedSize?: string
  ) => void;
  removeItem: (
    productId: string,
    variantWeight: string,
    grind: string,
    selectedColor?: string,
    selectedSize?: string
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  vatAmount: number;
  discountAmount: number;
  appliedCoupon: PromotionCoupon | null;
  discountCode: string | null;
  couponError: string | null;
  couponSuccess: string | null;
  isApplyingCoupon: boolean;
  applyCoupon: (code: string, customerEmail?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  removeCoupon: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  hasUnavailableItems: boolean;
  unavailableItems: CartItem[];
  getItemAvailability: (productId: string) => AvailabilityInfo;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getAvailabilityInfo } = useStock();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maison_milau_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<PromotionCoupon | null>(() => {
    try {
      const savedCoupon = localStorage.getItem('maison_milau_applied_coupon');
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('maison_milau_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('maison_milau_applied_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('maison_milau_applied_coupon');
      }
    } catch (e) {
      console.error('Failed to save applied coupon', e);
    }
  }, [appliedCoupon]);

  const getItemAvailability = (productId: string): AvailabilityInfo => {
    return getAvailabilityInfo({ id: productId });
  };

  const addItem = (itemToAdd: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const avail = getAvailabilityInfo({ id: itemToAdd.productId });
    if (!avail.isPurchasable) {
      alert(`Dit product (${itemToAdd.productName}) is momenteel ${avail.label.toLowerCase()} en kan niet worden besteld.`);
      return;
    }

    const qty = itemToAdd.quantity || 1;
    setItems((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.productId === itemToAdd.productId &&
          i.variantWeight === itemToAdd.variantWeight &&
          i.grindOption === itemToAdd.grindOption &&
          i.selectedColor === itemToAdd.selectedColor &&
          i.selectedSize === itemToAdd.selectedSize &&
          JSON.stringify(i.selectedBeans || []) === JSON.stringify(itemToAdd.selectedBeans || [])
      );
      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity += qty;
        return updated;
      }
      return [...prev, { ...itemToAdd, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (
    productId: string,
    variantWeight: string,
    grind: string,
    delta: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (delta > 0) {
      const avail = getAvailabilityInfo({ id: productId });
      if (!avail.isPurchasable) {
        alert(`Het aantal van dit artikel kan niet worden verhoogd omdat het momenteel ${avail.label.toLowerCase()} is.`);
        return;
      }
    }

    setItems((prev) => {
      return prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.variantWeight === variantWeight &&
            item.grindOption === grind &&
            (!selectedColor || item.selectedColor === selectedColor) &&
            (!selectedSize || item.selectedSize === selectedSize)
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (
    productId: string,
    variantWeight: string,
    grind: string,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.productId === productId &&
            i.variantWeight === variantWeight &&
            i.grindOption === grind &&
            (!selectedColor || i.selectedColor === selectedColor) &&
            (!selectedSize || i.selectedSize === selectedSize)
          )
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Calculate discount amount based on active coupon
  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * (appliedCoupon.discountValue / 100)) * 100) / 100;
    }
    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(subtotal, appliedCoupon.discountValue);
    }
    // free_shipping gives 0 discount on goods
    return 0;
  }, [appliedCoupon, subtotal]);

  // Shipping cost: free if subtotal >= 45, or cart empty, or free_shipping coupon applied
  const isFreeShipping =
    subtotal >= 45 || items.length === 0 || appliedCoupon?.discountType === 'free_shipping';
  const shippingCost = isFreeShipping ? 0 : 4.95;

  // 6% VAT on coffee beans and food products
  const vatAmount = Math.max(0, subtotal - discountAmount) * 0.06;
  const total = Math.max(0, subtotal - discountAmount) + shippingCost;

  const applyCoupon = async (code: string, customerEmail?: string) => {
    const cleanCode = (code || '').trim().toUpperCase();
    setCouponError(null);
    setCouponSuccess(null);

    if (!cleanCode) {
      setCouponError('Voer een geldige kortingscode in.');
      return { success: false, error: 'Voer een geldige kortingscode in.' };
    }

    setIsApplyingCoupon(true);
    try {
      const response = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cleanCode,
          cartSubtotal: subtotal,
          customerEmail,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        const errMsg = data.error || 'Ongeldige kortingscode.';
        setCouponError(errMsg);
        return { success: false, error: errMsg };
      }

      setAppliedCoupon(data.coupon);
      const msg = data.message || `Kortingscode ${cleanCode} succesvol toegepast!`;
      setCouponSuccess(msg);
      return { success: true, message: msg };
    } catch (err: any) {
      const errMsg = 'Er trad een netwerkfout op bij het valideren van de kortingscode.';
      setCouponError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  };

  const unavailableItems = items.filter((item) => {
    const avail = getAvailabilityInfo({ id: item.productId });
    return !avail.isPurchasable;
  });
  const hasUnavailableItems = unavailableItems.length > 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        shippingCost,
        vatAmount,
        discountAmount,
        appliedCoupon,
        discountCode: appliedCoupon ? appliedCoupon.code : null,
        couponError,
        couponSuccess,
        isApplyingCoupon,
        applyCoupon,
        removeCoupon,
        total,
        isCartOpen,
        setIsCartOpen,
        hasUnavailableItems,
        unavailableItems,
        getItemAvailability,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
