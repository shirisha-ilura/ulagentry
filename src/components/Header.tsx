import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentView?: 'welcome' | 'building' | 'dashboard' | 'connections';
  onNavigate?: (view: 'welcome' | 'building' | 'dashboard' | 'connections') => void;
  dashboardView?: 'workflow-runs' | 'analytics' | 'embed';
  onDashboardViewChange?: (view: 'workflow-runs' | 'analytics' | 'embed') => void;
}

export function Header({ currentView = 'welcome', onNavigate, dashboardView = 'workflow-runs', onDashboardViewChange }: HeaderProps) {
  const { resolvedTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position for transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Choose logo based on current theme
  const logoSrc = resolvedTheme === 'dark' 
    ? '/images/lagentry-dark-logo-no-bg.png' 
    : '/images/lagentry-light-logo.png';

  const handleLogoClick = () => {
    if (onNavigate) {
      onNavigate('welcome');
    }
  };

  const handleDashboardClick = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const handleConnectionsClick = () => {
    if (onNavigate) {
      onNavigate('connections');
    }
  };

  const handleDashboardNavClick = (item: string) => {
    if (onDashboardViewChange) {
      if (item === 'Analytics') {
        onDashboardViewChange('analytics');
      } else if (item === 'Workflow Runs') {
        onDashboardViewChange('workflow-runs');
      } else if (item === 'Embed') {
        onDashboardViewChange('embed');
      }
    }
  };

  // Dashboard navigation items
  const dashboardNavItems = [
    'Analytics',
    'Workflow Runs',
    'Embed'
  ];

  return (
    <header 
      className={`px-6 py-2 transition-all duration-300 fixed top-0 left-0 right-0 z-50 ${
        isScrolled 
          ? 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo on the left */}
        <div className="flex items-center">
          <button 
            onClick={handleLogoClick}
            className="transition-opacity duration-300 hover:opacity-80"
          >
            <img 
              src={logoSrc} 
              alt="Lagentry" 
              className="h-10 w-auto"
            />
          </button>
        </div>
        
        {/* Centered navigation */}
        <nav className="hidden md:flex space-x-6">
          {currentView === 'dashboard' ? (
            // Dashboard navigation items
            dashboardNavItems.map((item) => (
              <button 
                key={item}
                onClick={() => handleDashboardNavClick(item)}
                className={`text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 ${
                  (item === 'Workflow Runs' && dashboardView === 'workflow-runs') || 
                  (item === 'Analytics' && dashboardView === 'analytics') ||
                  (item === 'Embed' && dashboardView === 'embed')
                    ? resolvedTheme === 'dark' 
                      ? 'text-white font-medium' 
                      : 'text-orange-600 font-medium'
                    : ''
                }`}
              >
                {item}
              </button>
            ))
          ) : (
            // Regular navigation items
            <>
              {/* <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200">Enterprise</a> */}
              {/* <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200">Resources</a> */}
              <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 px-2 flex items-center gap-2">Pricing</a>
              <button 
                onClick={handleDashboardClick}
                className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 px-2 flex items-center gap-2"
              >
                Dashboard
              </button>

              {/* Connections button (LayoutDashboard icon) */}
              <button 
                onClick={handleConnectionsClick}
                className="p-2 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10 flex items-center gap-2 px-2"
                title="Connections"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
            </>
          )}
        </nav>
        
        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          
          <button className="p-2 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 text-orange-600 dark:text-gray-300 hover:text-orange-700 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}