import React from 'react';
import PreferencesStep, {Label as PreferencesStepLabel} from './right-steps-content/01_PreferencesStep';
import MealSelector, {Label as MealSelectorLabel} from './right-steps-content/02_MealSelector';
import type { PlanType, MealsPerWeek, CartItem } from '../main';

interface RightContentProps {
  currentStep: number;
  planType: PlanType;
  mealsPerWeek: MealsPerWeek;
  cartItems: CartItem[];
  onPlanTypeChange: (type: PlanType) => void;
  onMealsPerWeekChange: (meals: MealsPerWeek) => void;
  onNext: () => void;
  onAddToCart: (meal: CartItem) => void;
  setCurrentStep: (step: number) => void;
}

export default function RightContent({
  currentStep,
  planType,
  mealsPerWeek,
  cartItems,
  onPlanTypeChange,
  onMealsPerWeekChange,
  onNext,
  onAddToCart,
  setCurrentStep
}: RightContentProps) {
  const steps = [
    { 
      number: 1,
      title: PreferencesStepLabel,
      content: (
        <PreferencesStep
          planType={planType}
          mealsPerWeek={mealsPerWeek}
          onPlanTypeChange={onPlanTypeChange}
          onMealsPerWeekChange={onMealsPerWeekChange}
          onNext={onNext}
        />
      )
    },
    {
      number: 2,
      title: MealSelectorLabel,
      content: (
        <MealSelector
          onAddToCart={onAddToCart}
          selectedMeals={cartItems}
        />
      )
    }
  ];

  return (
    <div className="w-3/4">
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Build Your Plan</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Meal Plans include complete ready to eat, macro-balanced meals. Meal Prep offers pre-cooked, a la carte proteins, veggies, and starches to allow you to easily make your own tasty and nutritious meals.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-primary-faded p-8 rounded-r-xl">
            <img 
              src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"
              alt="Healthy meal preparation"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div 
              className="p-8 cursor-pointer" 
              onClick={() => setCurrentStep(step.number)}
            >
              <div className={`w-full text-left font-helvetica text-2xl font-medium transition-all duration-300 ease-in-out ${
                currentStep === step.number ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {String(step.number).padStart(2,'0')} {step.title}
              </div>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  currentStep === step.number ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="mt-8">
                  {step.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentStep === 2 && cartItems.length > 0 && (
        <div className="bg-primary/5 rounded-xl p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary font-medium">
                Selected: {cartItems.reduce((sum, item) => sum + item.quantity, 0)} of {mealsPerWeek} meals
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ 
                    width: `${(cartItems.reduce((sum, item) => sum + item.quantity, 0) / mealsPerWeek) * 100}%` 
                  }}
                />
              </div>
            </div>
            {cartItems.reduce((sum, item) => sum + item.quantity, 0) === mealsPerWeek && (
              <button 
                className="bg-secondary text-white px-6 py-2 rounded-full hover:bg-secondary/90 transition-colors"
                onClick={() => {/* Handle completion */}}
              >
                Complete Selection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}