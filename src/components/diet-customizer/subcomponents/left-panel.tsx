import React from 'react';
import StepsList from './left-panel-components/StepsList';
import CartSummary from './left-panel-components/CartSummary';
import type { CartItem } from '../main';

interface LeftPanelProps {
  currentStep: number;
  cartItems: CartItem[];
  onStepClick: (step: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export default function LeftPanel({
  currentStep,
  cartItems,
  onStepClick,
  onUpdateQuantity,
  onRemoveItem
}: LeftPanelProps) {
  return (
    <div className="w-1/4">
      <div className="sticky top-24 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Build your plan</h1>
          <p className="mt-2 text-gray-600">Delivery of <span className="text-secondary">July 04</span></p>
        </div>
        <hr/>
        <StepsList
          currentStep={currentStep}
          onStepClick={onStepClick}
        />
        <hr/>
        <CartSummary
          items={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      </div>
    </div>
  );
}