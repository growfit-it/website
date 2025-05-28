import React from 'react';
import type { PlanType, MealsPerWeek } from '../DietCustomizer';

interface PreferencesStepProps {
  planType: PlanType;
  mealsPerWeek: MealsPerWeek;
  onPlanTypeChange: (type: PlanType) => void;
  onMealsPerWeekChange: (meals: MealsPerWeek) => void;
  onNext: () => void;
}

export const Label = "Set Your Preferences";
export default function PreferencesStep({
  planType,
  mealsPerWeek,
  onPlanTypeChange,
  onMealsPerWeekChange,
  onNext
}: PreferencesStepProps) {
  const mealOptions: MealsPerWeek[] = [5, 7, 10, 14];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Plan Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['Chef\'s Choice', 'My Choice'] as PlanType[]).map((type) => (
            <button
              key={type}
              onClick={() => onPlanTypeChange(type)}
              className={`p-6 rounded-xl border-2 text-left transition-colors ${
                planType === type
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <h4 className="font-semibold mb-2">{type}</h4>
              <p className="text-sm text-gray-600">
                {type === 'Chef\'s Choice'
                  ? 'Let our chefs curate your weekly meals'
                  : 'Select your own meals each week'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Meals per Week</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mealOptions.map((option) => (
            <button
              key={option}
              onClick={() => onMealsPerWeekChange(option)}
              className={`p-4 rounded-xl border-2 text-center transition-colors ${
                mealsPerWeek === option
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <span className="text-2xl font-bold block mb-1">{option}</span>
              <span className="text-sm text-gray-600">meals/week</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-colors"
      >
        Continue to Meal Selection
      </button>
    </div>
  );
}