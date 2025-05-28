import React from 'react';
import type { CartItem } from '../DietCustomizer';

interface MealSelectorProps {
  onAddToCart: (meal: CartItem) => void;
  selectedMeals: CartItem[];
}

interface Meal {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
}

const sampleMeals: Meal[] = [
  {
    id: 1,
    title: 'Grilled Salmon Bowl',
    description: 'Fresh Atlantic salmon with quinoa, roasted vegetables, and lemon-dill sauce',
    image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
    price: 1290,
    macros: {
      calories: 450,
      protein: 35,
      carbs: 45,
      fat: 15
    },
    tags: ['clean', 'pescatarian']
  },
  {
    id: 2,
    title: 'Keto Chicken Alfredo',
    description: 'Zucchini noodles with grilled chicken and creamy keto-friendly Alfredo sauce',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    price: 1190,
    macros: {
      calories: 380,
      protein: 28,
      carbs: 8,
      fat: 28
    },
    tags: ['keto', 'clean']
  },
  {
    id: 3,
    title: 'Vegan Buddha Bowl',
    description: 'Colorful bowl with chickpeas, sweet potato, kale, and tahini dressing',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    price: 1090,
    macros: {
      calories: 420,
      protein: 15,
      carbs: 65,
      fat: 12
    },
    tags: ['plant-based', 'clean']
  }
];

const tagColors = {
  'clean': 'bg-blue-100 text-blue-800',
  'keto': 'bg-purple-100 text-purple-800',
  'plant-based': 'bg-green-100 text-green-800',
  'pescatarian': 'bg-cyan-100 text-cyan-800'
};
export const Label = "Select Your Meals";
export default function MealSelector({ onAddToCart, selectedMeals }: MealSelectorProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(cents / 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sampleMeals.map((meal) => {
        const isSelected = selectedMeals.some(item => item.id === meal.id);
        
        return (
          <div key={meal.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{meal.title}</h3>
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(meal.price)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{meal.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {meal.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${tagColors[tag]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <span className="block text-sm font-semibold">{meal.macros.calories}</span>
                    <span className="text-xs text-gray-500">kcal</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold">{meal.macros.protein}g</span>
                    <span className="text-xs text-gray-500">protein</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold">{meal.macros.carbs}g</span>
                    <span className="text-xs text-gray-500">carbs</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold">{meal.macros.fat}g</span>
                    <span className="text-xs text-gray-500">fat</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onAddToCart({
                  id: meal.id,
                  name: meal.title,
                  price: meal.price,
                  quantity: 1
                })}
                className={`w-full py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {isSelected ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}