import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer, CurrentSubscription, ProductItem } from '../lib/types';

type TabType = 'profile' | 'subscription' | 'meals';

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [meals, setMeals] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadCustomerData();
  }, []);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        locale: customer.locale || 'fi'
      });
    }
  }, [customer]);

  async function loadCustomerData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get customer data
      const { data: customerData, error: customerError } = await supabase
        .from('Customers')
        .select('*')
        .eq('email', user.email)
        .single();

      if (customerError) throw customerError;
      setCustomer(customerData);

      // Get subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('CurrentSubscriptions')
        .select('*')
        .eq('customerId', customerData.id)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }
      
      setSubscription(subscriptionData || null);

      // Get meals data
      const { data: mealsData, error: mealsError } = await supabase
        .from('productitems')
        .select('*')
        .eq('type', 'Bundled Meal');

      if (mealsError) throw mealsError;
      setMeals(mealsData || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleInputChange(field: keyof Customer, value: string) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  }

  async function handleSaveProfile() {
    if (!customer) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('Customers')
        .update(formData)
        .eq('id', customer.id);

      if (error) throw error;
      
      setCustomer(prev => prev ? { ...prev, ...formData } : null);
      setHasChanges(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function toggleSubscriptionStatus() {
    if (!subscription || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newStatus = subscription.status === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('CurrentSubscriptions')
        .update({ status: newStatus })
        .eq('id', subscription.id);

      if (error) throw error;
      
      setSubscription(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-32 container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 container mx-auto px-6 py-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'subscription', label: 'Subscription' },
              { id: 'meals', label: 'Meals' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && customer && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={handleSaveProfile}
                  disabled={!hasChanges || isUpdating}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    hasChanges 
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={customer.email}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Locale</label>
                  <select
                    value={formData.locale || 'fi'}
                    onChange={(e) => handleInputChange('locale', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="fi">Finnish</option>
                    <option value="en">English</option>
                    <option value="sv">Swedish</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
              {subscription ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Plan Type</p>
                      <p className="text-lg font-medium text-gray-900">{subscription.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-lg font-medium text-gray-900">{subscription.status}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={toggleSubscriptionStatus}
                      disabled={isUpdating}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        subscription.status === 'active'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUpdating 
                        ? 'Updating...' 
                        : subscription.status === 'active' 
                          ? 'Pause Subscription' 
                          : 'Resume Subscription'
                      }
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active subscription found.</p>
                  <a
                    href="/plan-selector"
                    className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                  >
                    Choose a Plan
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Meals Tab */}
          {activeTab === 'meals' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Meals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map(meal => (
                  <div 
                    key={meal.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <img
                      src={`https://source.unsplash.com/featured/?food&${meal.id}`}
                      alt={meal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{meal.description}</p>
                      <button 
                        className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Select Meal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}