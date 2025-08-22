import React from 'react';
import { Calendar, Plus, BarChart3, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: 'dashboard' | 'add-visit' | 'revenue' | 'settings' | 'profile';
  onViewChange: (view: 'dashboard' | 'add-visit' | 'revenue' | 'settings' | 'profile') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar, desktopOnly: false },
    { id: 'add-visit', label: 'Add Visit', icon: Plus, desktopOnly: true },
    { id: 'revenue', label: 'Revenue', icon: BarChart3, desktopOnly: false },
    { id: 'settings', label: 'Settings', icon: Settings, desktopOnly: true },
    { id: 'profile', label: 'Profile', icon: User, desktopOnly: true }
  ] as const;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-12">
              <div className="text-2xl font-bold text-blue-600">Go Clinic</div>
              <div className="flex items-center space-x-8">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => onViewChange(id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      currentView === id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-600">
                Welcome, {user?.name}
              </div>
              <button
                onClick={() => onViewChange('profile')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <User className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 border-b border-gray-100">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <div className="text-xl font-bold text-blue-600">Go Clinic</div>
            <div className="flex items-center space-x-4">
              {navItems
                .filter(item => !item.desktopOnly)
                .map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => onViewChange(id)}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      currentView === id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              <button
                onClick={() => onViewChange('profile')}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                aria-label="Profile"
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;