import React, { useState } from 'react';
import { Search, Filter, Star, Download, Eye } from 'lucide-react';

export function TemplateLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'customer-support', name: 'Customer Support' },
    { id: 'sales', name: 'Sales & Marketing' },
    { id: 'operations', name: 'Operations' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'finance', name: 'Finance' }
  ];

  const templates = [
    {
      id: 1,
      name: 'Customer Support Assistant',
      description: 'Handles FAQ queries, ticket routing, and basic troubleshooting',
      category: 'customer-support',
      rating: 4.8,
      downloads: 1250,
      integrations: ['Gmail', 'Slack', 'Zendesk'],
      featured: true
    },
    {
      id: 2,
      name: 'Email Summarizer',
      description: 'Daily email processing with smart categorization and Slack updates',
      category: 'operations',
      rating: 4.6,
      downloads: 890,
      integrations: ['Gmail', 'Slack', 'Calendar'],
      featured: false
    },
    {
      id: 3,
      name: 'Sales Lead Qualifier',
      description: 'Automated lead scoring and CRM integration with follow-up scheduling',
      category: 'sales',
      rating: 4.9,
      downloads: 750,
      integrations: ['Salesforce', 'HubSpot', 'Calendar'],
      featured: true
    },
    {
      id: 4,
      name: 'HR Onboarding Bot',
      description: 'Automates new employee onboarding process and document collection',
      category: 'hr',
      rating: 4.7,
      downloads: 620,
      integrations: ['Slack', 'Google Drive', 'Calendar'],
      featured: false
    },
    {
      id: 5,
      name: 'Operations Monitor',
      description: 'System monitoring with automated alerts and incident response',
      category: 'operations',
      rating: 4.5,
      downloads: 480,
      integrations: ['Slack', 'Jira', 'PagerDuty'],
      featured: false
    },
    {
      id: 6,
      name: 'Invoice Processor',
      description: 'Automated invoice processing and approval workflow management',
      category: 'finance',
      rating: 4.4,
      downloads: 320,
      integrations: ['Gmail', 'QuickBooks', 'Slack'],
      featured: false
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Template Library</h3>
        
        {/* Search and Filter */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 hover:border-gray-300 transition-colors ${
                template.featured ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-white">{template.name}</h4>
                    {template.featured && (
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{template.description}</p>
                  
                  {/* Integrations */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.integrations.map((integration) => (
                      <span
                        key={integration}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
                      >
                        {integration}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-amber-400 fill-current" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-700">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25">
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No templates found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}