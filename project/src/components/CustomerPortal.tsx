import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer, Order, ProductItem, ProductBundle } from '../lib/types';
import { formatPrice } from '../lib/types';

type TabType = 'profile' | 'orders' | 'subscription';

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<(Order & { product: ProductItem })[]>([]);
  const [bundle, setBundle] = useState<ProductBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomerData();
  }, []);

  async function loadCustomerData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get customer data
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .single();

      if (customerError) throw customerError;
      setCustomer(customerData);

      // Get orders with product details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          product:productitems(*)
        `)
        .eq('customerid', customerData.id)
        .order('deliverydate', { ascending: false });

      if (orderError) throw orderError;
      setOrders(orderData);

      // Get bundle details if customer has a subscription label
      if (customerData.main_subscription_label) {
        const { data: bundleData, error: bundleError } = await supabase
          .from('productbundles')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('fullname', customerData.main_subscription_label)
          .single();

        if (bundleError && bundleError.code !== 'PGRST116') throw bundleError;
        setBundle(bundleData);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<Customer>) {
    try {
      const { error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', customer?.id);

      if (error) throw error;
      setCustomer(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
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
              { id: 'orders', label: 'Orders' },
              { id: 'subscription', label: 'Subscription' }
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
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
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
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{order.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          Delivery Date: {new Date(order.deliverydate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {order.quantity}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'AlreadyDelivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No orders found</p>
                )}
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && customer && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Plan Type</p>
                    <p className="text-lg font-medium text-gray-900">{customer.subscription_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-medium text-gray-900">{customer.subscription_status}</p>
                  </div>
                  {bundle && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Meals per Week</p>
                        <p className="text-lg font-medium text-gray-900">{bundle.subscriptionmeals}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Price</p>
                        <p className="text-lg font-medium text-gray-900">
                          {formatPrice(bundle.priceineurcents)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                {customer.subscription_status === 'active' ? (
                  <button
                    onClick={() => updateProfile({ subscription_status: 'paused' })}
                    className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200"
                  >
                    Pause Subscription
                  </button>
                ) : (
                  <button
                    onClick={() => updateProfile({ subscription_status: 'active' })}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200"
                  >
                    Resume Subscription
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}