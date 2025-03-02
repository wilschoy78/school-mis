
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {user && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Welcome, {user.name}!</h2>
          <p className="text-gray-600">You're logged in as: <span className="font-medium capitalize">{user.role.toLowerCase().replace('_', ' ')}</span></p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-medium text-lg mb-2">Quick Stats</h3>
          <p className="text-gray-600">View your most important metrics at a glance</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-medium text-lg mb-2">Recent Activity</h3>
          <p className="text-gray-600">See the latest updates and changes</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-medium text-lg mb-2">Quick Actions</h3>
          <p className="text-gray-600">Perform common tasks with one click</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
