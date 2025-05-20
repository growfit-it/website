import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ProductItem, Category } from '../lib/types';

interface MealListProps {
  selectedCategory?: number;
}

export default function MealList({ selectedCategory }: MealListProps) {
  const [meals, setMeals] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [mealsResult, categoriesResult] = await Promise.all([
        supabase
          .from('productitems')
          .select('*')
          .eq('type', 'Bundled Meal'),
        supabase
          .from('categories')
          .select('*')
      ]);

      if (mealsResult.error) throw mealsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      setMeals(mealsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(c => c !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading meals: {error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Category Filters */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`px-6 py-2 rounded-full border-2 transition-colors ${
                selectedCategories.includes(category.id)
                  ? 'border-primary bg-primary text-white'
                  : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {meals.map(meal => (
          <div key={meal.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img 
              src={`https://source.unsplash.com/featured/?food&${meal.id}`}
              alt={meal.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{meal.name}</h3>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-primary/10 text-primary mt-2">
                    {meal.type}
                  </span>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90">
                Add to Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}