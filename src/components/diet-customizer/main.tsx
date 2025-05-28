import React, { useState } from 'react';
import LeftPanel from './subcomponents/left-panel';
import RightContent from './subcomponents/right-content';

interface DietCustomizerProps {
  language?: string;
}

export type PlanType = 'My Choice' | 'Chef\'s Choice';
export type MealsPerWeek = 5 | 7 | 10 | 14;

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function DietCustomizer({ language = 'en' }: DietCustomizerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [planType, setPlanType] = useState<PlanType>('Chef\'s Choice');
  const [mealsPerWeek, setMealsPerWeek] = useState<MealsPerWeek>(5);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (meal: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === meal.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
  };

  const removeFromCart = (mealId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== mealId));
  };

  const updateQuantity = (mealId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(mealId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === mealId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row gap-x-8">
          <LeftPanel
            currentStep={currentStep}
            cartItems={cartItems}
            onStepClick={setCurrentStep}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            
          />
          <RightContent
            currentStep={currentStep}
            planType={planType}
            mealsPerWeek={mealsPerWeek}
            cartItems={cartItems}
            onPlanTypeChange={setPlanType}
            onMealsPerWeekChange={setMealsPerWeek}
            onNext={() => setCurrentStep(2)}
            onAddToCart={addToCart}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>
    </div>
  );
}