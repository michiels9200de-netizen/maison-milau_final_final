import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
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

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('maison_milau_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  const getItemAvailability = (productId: string): AvailabilityInfo => {
    return getAvailabilityInfo({ id: productId });
  };

  const addItem = (itemToAdd: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    // CRITICAL AVAILABILITY CHECK:
    // Only products with status 'available' or 'freshly_roasted' may be added to cart.
    // 'out_of_stock' must be strictly rejected.
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
    // Disallow increasing quantity for unavailable products
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
  // Free shipping starting from €45.00 in Belgium, otherwise €4.95
  const shippingCost = subtotal >= 45 || items.length === 0 ? 0 : 4.95;
  // 6% VAT on coffee beans and food products
  const vatAmount = subtotal * 0.06;
  const total = subtotal + shippingCost;

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
