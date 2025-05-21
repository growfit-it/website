import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, ProductBundle, SubscriptionType } from '../lib/types';
import { formatPrice } from '../lib/types';

interface FormData {
  subscription_type: SubscriptionType;
  bundle_id: number | null;
  name: string;
  email: string;
}

export default function PlanSelector() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bundles, setBundles] = useState<(ProductBundle & { category: Category })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    subscription_type: 'Chef\'s Choice',
    bundle_id: null,
    name: '',
    email: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [categoriesResult, bundlesResult] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('productbundles')
          .select(`
            *,
            category:categories!inner(*)
          `)
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (bundlesResult.error) throw bundlesResult.error;

      setCategories(categoriesResult.data || []);
      setBundles(bundlesResult.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.bundle_id) {
      setError('Please select a meal plan');
      return;
    }

    try {
      const selectedBundle = bundles.find(b => b.id === formData.bundle_id);
      if (!selectedBundle) throw new Error('Invalid bundle selected');

      const { error } = await supabase
        .from('customers')
        .insert([{
          name: formData.name,
          email: formData.email,
          subscription_type: formData.subscription_type,
          subscription_status: 'active',
          main_subscription_label: selectedBundle.fullname
        }]);

      if (error) throw error;
      
      window.location.href = '/account';
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredBundles = selectedCategory
    ? bundles.filter(b => b.categoryfilter === selectedCategory)
    : bundles;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Plan Type</label>
              <div className="grid grid-cols-2 gap-4">
                {(['Chef\'s Choice', 'My Choice'] as SubscriptionType[]).map((type) => (
                  <label key={type} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="subscription_type"
                      className="form-radio h-5 w-5 text-primary"
                      checked={formData.subscription_type === type}
                      onChange={() => setFormData({
                        ...formData,
                        subscription_type: type
                      })}
                    />
                    <span className="ml-2">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Meal Category</label>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="category"
                      className="form-radio h-5 w-5 text-primary"
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Select Your Bundle</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredBundles.map((bundle) => (
                  <label
                    key={bundle.id}
                    className={`
                      flex flex-col p-4 border-2 rounded-lg cursor-pointer
                      ${formData.bundle_id === bundle.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="bundle"
                      className="form-radio h-5 w-5 text-primary"
                      checked={formData.bundle_id === bundle.id}
                      onChange={() => setFormData({
                        ...formData,
                        bundle_id: bundle.id
                      })}
                    />
                    <div className="mt-2">
                      <p className="font-medium">{bundle.subscriptionmeals} Meals</p>
                      <p className="text-sm text-gray-600">{bundle.category.name}</p>
                      <p className="text-lg font-bold text-primary mt-2">
                        {formatPrice(bundle.priceineurcents)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Your Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                value={formData.name}
                onChange={(e) => setFormData({
                  ...formData,
                  name: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                value={formData.email}
                onChange={(e) => setFormData({
                  ...formData,
                  email: e.target.value
                })}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-primary/90"
        >
          Start Your Meal Plan
        </button>
      </form>
    </div>
  );
}