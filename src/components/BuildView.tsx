import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Zap, CheckCircle, ArrowRight, Database, Upload, X, Brain, Paperclip, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { HashLoader } from 'react-spinners';
import ReactFlow, { 
  Node, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  EdgeTypes,
  BaseEdge,
  getBezierPath
} from 'reactflow';
import 'reactflow/dist/style.css';
import { llmService } from '../services/llmService';
import { conversationMemoryService } from '../services/conversationMemoryService';
import { workflowAnalysisService } from '../services/workflowAnalysisService';
import { KnowledgeBaseModal } from './KnowledgeBaseModal';
import { FileUploadModal } from './FileUploadModal';

// New Lead Configuration Panel Component
interface NewLeadConfigPanelProps {
  onClose: () => void;
}

const NewLeadConfigPanel = ({ onClose }: NewLeadConfigPanelProps) => {
  const [config, setConfig] = useState({
    account: 'hazelliranii@gmail.com',
    folderId: 'root',
    sheetId: 'GCC_Contacts_For_ILURA_AI_Calls.xlsx',
    worksheet: 'in',
    pollingSchedule: '60'
  });
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Lead Config:', config);
    // Here you would typically save the configuration
    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center">
            <img src="/images/google-sheets-icon.png" alt="Google Sheets" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Lead Added</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Microsoft Excel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Description */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Triggers when a new row is added to an Excel worksheet.
        </p>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 bg-white dark:bg-gray-900">
        {/* Account/Connection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Account/Connection
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <img src="/images/google-sheets-icon.png" alt="Excel" className="h-5 w-5" />
                <span>{config.account}</span>
              </div>
              <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showAccountDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showAccountDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  {/* Selected Account */}
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center space-x-3">
                      <img src="/images/google-sheets-icon.png" alt="Excel" className="h-5 w-5" />
                      <span className="text-gray-900 dark:text-white">{config.account}</span>
                    </div>
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  {/* Add Account Option */}
                  <button
                    type="button"
                    onClick={() => {
                      // Handle add account functionality
                      console.log('Add account clicked');
                      setShowAccountDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Add account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Folder ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Folder ID
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">The ID of the folder where the item is located</p>
          <div className="relative">
            <input
              type="text"
              value={config.folderId}
              onChange={(e) => setConfig(prev => ({ ...prev, folderId: e.target.value }))}
              className="w-full pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sheet ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sheet ID
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">The ID of the spreadsheet you want to use</p>
          <div className="relative">
            <input
              type="text"
              value={config.sheetId}
              onChange={(e) => setConfig(prev => ({ ...prev, sheetId: e.target.value }))}
              className="w-full pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Worksheet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Worksheet
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">The name of the worksheet to use</p>
          <div className="relative">
            <input
              type="text"
              value={config.worksheet}
              onChange={(e) => setConfig(prev => ({ ...prev, worksheet: e.target.value }))}
              className="w-full pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Polling Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Polling schedule (In Seconds) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Set how often we check for new events. Warning: A lower interval may cause rate-limiting issues with this application...
          </p>
          <div className="relative">
            <input
              type="number"
              value={config.pollingSchedule}
              onChange={(e) => setConfig(prev => ({ ...prev, pollingSchedule: e.target.value }))}
              className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 cursor-pointer hover:underline">More</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

// Call Lead Configuration Panel Component
interface CallLeadConfigPanelProps {
  onClose: () => void;
}

const CallLeadConfigPanel = ({ onClose }: CallLeadConfigPanelProps) => {
  const [model] = useState('Claude 4 Sonnet');
  const [askForConfirmation, setAskForConfirmation] = useState(false);
  const [fromNumber, setFromNumber] = useState('');
  const [toNumber, setToNumber] = useState('');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 border border-yellow-300 flex items-center justify-center">
            <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6v2a10 10 0 0010 10h2v-1a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2C9.163 22 2 14.837 2 6V4a2 2 0 011-1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Call Lead</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Lindy Phone → Make Phone Call</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400">Make an outbound phone call.</p>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
          <div className="relative">
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-3 border border-transparent rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span>Default · Currently {model}</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Ask for Confirmation */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ask for Confirmation</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Require the agent to ask for confirmation before performing this action</p>
          <button
            type="button"
            onClick={() => setAskForConfirmation(!askForConfirmation)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${askForConfirmation ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${askForConfirmation ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Phone Number From */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number From <span className="text-red-500">(required)</span></label>
            <button type="button" className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-purple-600 dark:text-purple-400 text-sm hover:text-purple-700 dark:hover:text-purple-300">
              <svg className="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 11l2-1-1-2 2 1 1-2 1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2z"/>
              </svg>
              <span>Prompt AI</span>
              <span className="ml-2 flex flex-col justify-between leading-none text-purple-500 h-3.5">
                <span className="-mb-0.5">&lt;</span>
                <span className="mt-0.5">&gt;</span>
              </span>
            </button>
          </div>
          <div>
            <input
              type="text"
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
              placeholder="Write a prompt"
              className="w-full px-3 py-3 border border-purple-200 rounded-lg bg-purple-50 text-purple-600 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Phone Number To */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number To <span className="text-red-500">(required)</span></label>
            <button type="button" className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-purple-600 dark:text-purple-400 text-sm hover:text-purple-700 dark:hover:text-purple-300">
              <svg className="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 11l2-1-1-2 2 1 1-2 1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2z"/>
              </svg>
              <span>Prompt AI</span>
              <span className="ml-2 flex flex-col justify-between leading-none text-purple-500 h-3.5">
                <span className="-mb-0.5">&lt;</span>
                <span className="mt-0.5">&gt;</span>
              </span>
            </button>
          </div>
          <div>
            <input
              type="text"
              value={toNumber}
              onChange={(e) => setToNumber(e.target.value)}
              placeholder="Extract the phone number from the new row data"
              className="w-full px-3 py-3 border border-purple-200 bg-purple-50 text-purple-600 placeholder-purple-400 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">The phone number to call.</p>
        </div>

        {/* Upgrade notice */}
        <div className="flex items-start space-x-3 p-4 border border-amber-200 bg-amber-50 text-amber-800 rounded-lg">
          <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-7.4 12.8A1 1 0 003.7 18h16.6a1 1 0 00.86-1.53l-7.4-12.6a1 1 0 00-1.7 0z"/></svg>
          <div className="text-sm">
            <div>To enable voice customization, language selection, and more than 30 concurrent calls, upgrade to the Business plan.</div>
            <button className="mt-2 inline-flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pitch Product & Qualify Lead Configuration Panel
interface PitchProductConfigPanelProps {
  onClose: () => void;
}

const PitchProductConfigPanel = ({ onClose }: PitchProductConfigPanelProps) => {
  const [prompt, setPrompt] = useState(`You are calling a lead to pitch your product. Use the provided script to present the product professionally. Listen to their responses and determine if they are interested. If they show interest, proceed to book a sales call. If not interested, politely end the call.`);
  const [model] = useState('Claude 4 Sonnet');
  const [confirmation, setConfirmation] = useState<'Never' | 'Always' | 'When using skills'>('Never');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-300 flex items-center justify-center">
            <svg className="h-4 w-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pitch Product & Qualify Lead</h2>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400">Let AI decide what to do, until an exit condition is met.</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[160px] rounded-lg border border-purple-400 bg-purple-50 text-purple-700 p-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
          <button type="button" className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-gray-100 text-gray-900">
            <span>Default · Currently {model}</span>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ask for Confirmation</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Require this agent step to ask for confirmation before using any skills with side effects.</p>
          <button type="button" className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-gray-300 bg-white text-gray-900">
            <span>{confirmation}</span>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Add actions for this agent to access when needed.</p>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-300">
            <div className="flex items-center space-x-2 text-gray-800">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-700">📞</span>
              <span>Lindy Phone · End Call</span>
            </div>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-sky-500 text-white">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Check Calendar Availability Configuration Panel
interface CheckCalendarConfigPanelProps {
  onClose: () => void;
}

const CheckCalendarConfigPanel = ({ onClose }: CheckCalendarConfigPanelProps) => {
  const [timeWindows, setTimeWindows] = useState('Generate time windows for the next 2 weeks during business hours (9 AM - 5 PM, Monday-Friday) for potential sales call slots');
  const [workdayStart, setWorkdayStart] = useState('9');
  const [workdayEnd, setWorkdayEnd] = useState('17');
  const [maxMeetingHours, setMaxMeetingHours] = useState('6');
  const [ignoreOutOfOffice, setIgnoreOutOfOffice] = useState(false);
  const [ignoreAllDayEvents, setIgnoreAllDayEvents] = useState(false);
  const [ignoreBlockedTime, setIgnoreBlockedTime] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
            <img src="/images/google-calendar-icon.png" alt="Google Calendar" className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Check Calendar Availability</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Google Calendar → Check Availability</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Checks if the user and optional attendees are available during specific time windows. Returns whic...
            <button className="text-blue-600 hover:underline ml-1">More</button>
          </p>
        </div>

        {/* Connection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connection</label>
          <button type="button" className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">G</div>
              <span>hazelliranii@gmail.com</span>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
          <button type="button" className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-gray-100 text-gray-900">
            <span>Default · Currently Claude 4 Sonnet</span>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Time Windows */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Windows <span className="text-red-500">(required)</span></label>
            <button type="button" className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-purple-600 text-sm hover:text-purple-700">
              <svg className="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 11l2-1-1-2 2 1 1-2 1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2z"/>
              </svg>
              <span>Prompt AI</span>
              <span className="ml-2 flex flex-col justify-between leading-none text-purple-500 h-3.5">
                <span className="-mb-0.5">&lt;</span>
                <span className="mt-0.5">&gt;</span>
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">List of time windows to check for availability.</p>
          <textarea
            value={timeWindows}
            onChange={(e) => setTimeWindows(e.target.value)}
            className="w-full min-h-[100px] rounded-lg border border-purple-200 bg-purple-50 text-purple-600 placeholder-purple-400 p-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Calendars to Check */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Calendars to Check</label>
            <button type="button" className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-green-600 text-sm hover:text-green-700">
              <svg className="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 11l2-1-1-2 2 1 1-2 1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2z"/>
              </svg>
              <span>Auto</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">The accounts agent will check calendar availability if it has access. Your own calendar is always included.</p>
          <input
            type="text"
            placeholder="AI will automatically fill this field"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            disabled
          />
        </div>

        {/* User Preferences - Collapsible */}
        <div>
          <button className="flex items-center justify-between w-full text-left">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">User Preferences</h3>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="mt-4 space-y-4">
            {/* Workday Start Hour */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Workday Start Hour</label>
                <button type="button" className="text-xs text-gray-600 hover:text-gray-800">Set Manually</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">0-24, inclusive (e.g. 9 for 9am). Expressed in your local time.</p>
              <input
                type="number"
                value={workdayStart}
                onChange={(e) => setWorkdayStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>

            {/* Workday End Hour */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Workday End Hour</label>
                <button type="button" className="text-xs text-gray-600 hover:text-gray-800">Set Manually</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">0-24, inclusive (e.g. 17 for 5pm). Expressed in your local time.</p>
              <input
                type="number"
                value={workdayEnd}
                onChange={(e) => setWorkdayEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>

            {/* Allowed Days Of Week */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allowed Days Of Week</label>
                <button type="button" className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-green-600 text-xs hover:text-green-700">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 11l2-1-1-2 2 1 1-2 1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2z"/>
                  </svg>
                  <span>Auto</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Most people work Mon-Fri.</p>
            </div>

            {/* Maximum Meeting Hours per Day */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maximum Meeting Hours per Day</label>
                <button type="button" className="text-xs text-gray-600 hover:text-gray-800">Set Manually</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Most people can only handle 6 hours/day.</p>
              <input
                type="number"
                value={maxMeetingHours}
                onChange={(e) => setMaxMeetingHours(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>

            {/* Ignore Out-of-Office */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ignore Out-of-Office?</label>
                <button type="button" className="text-xs text-gray-600 hover:text-gray-800">Set Manually</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Set to true to ignore out-of-office events when checking for busy times.</p>
              <button
                type="button"
                onClick={() => setIgnoreOutOfOffice(!ignoreOutOfOffice)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ignoreOutOfOffice ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${ignoreOutOfOffice ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Ignore All-Day Events */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ignore All-Day Events?</label>
                <button type="button" className="text-xs text-gray-600 hover:text-gray-800">Set Manually</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Set to true to ignore all-day events when checking for busy times. Does not ignore OOO events.</p>
              <button
                type="button"
                onClick={() => setIgnoreAllDayEvents(!ignoreAllDayEvents)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ignoreAllDayEvents ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${ignoreAllDayEvents ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Ignore Blocked Time */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ignore Blocked Time</label>
                <button type="button" className="text-xs text-gray-600 hover:text-gray-800">Set Manually</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Set to true to treat blocked time on your calendar as available. Blocked time is events where you are the only...
                <button className="text-blue-600 hover:underline ml-1">More</button>
              </p>
              <button
                type="button"
                onClick={() => setIgnoreBlockedTime(!ignoreBlockedTime)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ignoreBlockedTime ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${ignoreBlockedTime ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Action Modal Component
interface AddActionModalProps {
  onClose: () => void;
  onActionSelect: (actionId: string) => void;
}

const AddActionModal = ({ onClose, onActionSelect }: AddActionModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Top');

  const categories = [
    { id: 'Top', name: 'Top', icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )},
    { id: 'Apps', name: 'Apps', icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
      </svg>
    )},
    { id: 'Chat', name: 'Chat', icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    )},
    { id: 'AI', name: 'AI', icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    )},
    { id: 'Logic', name: 'Logic', icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )},
    { id: 'Scrapers', name: 'Scrapers', icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
      </svg>
    )},
    { id: 'By Lindy', name: 'By Lindy', icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )}
  ];

  const actions = [
    // Top/Apps
    { id: 'google-calendar', name: 'Google Calendar', category: 'Apps', icon: (
      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      </div>
    )},
    { id: 'hubspot', name: 'HubSpot', category: 'Apps', icon: (
      <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    )},
    { id: 'tiktok', name: 'TikTok', category: 'Scrapers', icon: (
      <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      </div>
    )},
    { id: 'instagram', name: 'Instagram', category: 'Scrapers', icon: (
      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
    )},
    
    // Chat
    { id: 'slack', name: 'Slack', category: 'Chat', icon: (
      <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
        </svg>
      </div>
    )},
    { id: 'gmail', name: 'Gmail', category: 'Chat', icon: (
      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819L12 8.73l6.545-4.91h3.819c.904 0 1.636.732 1.636 1.636z"/>
        </svg>
      </div>
    )},
    { id: 'outlook', name: 'Microsoft Outlook', category: 'Chat', icon: (
      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.5 3h9A1.5 1.5 0 0 1 18 4.5v15A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3zM12 6.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM7.5 6.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 9.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM7.5 9.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 12.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM7.5 12.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"/>
        </svg>
      </div>
    )},
    { id: 'telegram', name: 'Telegram', category: 'Chat', icon: (
      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </div>
    )},
    
    // By Lindy
    { id: 'lindy-computer', name: 'Lindy Computer', category: 'By Lindy', icon: (
      <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
        </svg>
      </div>
    )},
    { id: 'lindy-utilities', name: 'Lindy Utilities', category: 'By Lindy', icon: (
      <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    )},
    { id: 'run-code', name: 'Run Code', category: 'By Lindy', icon: (
      <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    )},
    { id: 'http', name: 'HTTP', category: 'By Lindy', icon: (
      <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">HTTP</span>
      </div>
    )},
    
    // AI
    { id: 'agent-step', name: 'Agent Step', category: 'AI', icon: (
      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    )},
    { id: 'knowledge-base', name: 'Knowledge Base', category: 'AI', icon: (
      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
        </svg>
      </div>
    )},
    { id: 'ai-generic', name: 'AI', category: 'AI', icon: (
      <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
    )},
    
    // Logic
    { id: 'condition', name: 'Condition', category: 'Logic', icon: (
      <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
    )},
    { id: 'enter-loop', name: 'Enter Loop', category: 'Logic', icon: (
      <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </div>
    )},
    
    // Scrapers
    { id: 'linkedin', name: 'LinkedIn', category: 'Scrapers', icon: (
      <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </div>
    )},
    { id: 'youtube', name: 'YouTube', category: 'Scrapers', icon: (
      <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
    )},
    
    // Linked Actions
    { id: 'lindy-phone', name: 'Lindy Phone', category: 'Linked Actions', icon: (
      <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </div>
    )},
    { id: 'chat-agent', name: 'Chat with this Agent', category: 'Linked Actions', icon: (
      <div className="w-6 h-6 bg-brown-500 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
    )}
  ];

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Top' || action.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleActionClick = (actionId: string) => {
    console.log('Action clicked:', actionId);
    onActionSelect(actionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Action</h2>
              <p className="text-sm text-gray-600 mt-1">Select an action to add to your agent.</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No actions found</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center justify-center">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Action Configuration Panel Component
interface ActionConfigPanelProps {
  onClose: () => void;
  selectedAction: string | null;
}

const ActionConfigPanel = ({ onClose, selectedAction }: ActionConfigPanelProps) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3 rounded-lg bg-pink-500 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Action</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">⋯</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-pink-500 flex items-center justify-center">
          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Select an action</h4>
        
        <button
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white font-medium"
        >
          Select action
        </button>
      </div>
    </div>
  );
};

// Select Action Modal Component (simplified version)
interface SelectActionModalProps {
  onClose: () => void;
  onActionSelect: (actionId: string) => void;
}

const SelectActionModal = ({ onClose, onActionSelect }: SelectActionModalProps) => {
  const handleActionSelect = (actionId: string) => {
    onActionSelect(actionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-xl w-80 max-h-[60vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-lg bg-pink-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Select Action</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">⋯</span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-pink-500 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Select an action</h3>
          
          <button
            onClick={() => handleActionSelect('gmail')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-900 font-medium"
          >
            Select action
          </button>
        </div>
      </div>
    </div>
  );
};

// Select Next Step Panel Component
interface SelectNextStepPanelProps {
  onClose: () => void;
  onOpenAddAction: () => void;
}

const SelectNextStepPanel = ({ onClose, onOpenAddAction }: SelectNextStepPanelProps) => {
  const steps = [
    {
      id: 'action',
      title: 'Perform an action',
      icon: (
        <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 'search',
      title: 'Search knowledge base',
      icon: (
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      )
    },
    {
      id: 'loop',
      title: 'Enter loop',
      icon: (
        <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      )
    },
    {
      id: 'condition',
      title: 'Condition',
      icon: (
        <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      id: 'agent',
      title: 'Enter agent step',
      icon: (
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      )
    }
  ];

  const handleStepClick = (stepId: string) => {
    if (stepId === 'action') {
      onOpenAddAction();
    } else {
      // Handle other steps
      console.log('Step clicked:', stepId);
      onClose();
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-800">Select next step</h3>
      </div>
      
      <div className="space-y-1">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(step.id)}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6">
                {step.icon}
              </div>
              <span className="text-sm text-gray-800">{step.title}</span>
            </div>
            <div className="flex items-center justify-center">
              <Plus className="h-4 w-4 text-gray-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface AgentConfiguration {
  agent_name: string;
  llm_model: string;
  system_prompt: string;
  tools_to_activate: string[];
  prerequisites: {
    oauth?: string[];
    files?: string[];
    database_credentials?: boolean;
    pinecone_index_name?: string;
  };
}

interface BuildViewProps {
  userPrompt: string;
  isBuilding: boolean;
  buildProgress: number;
  isAgentReady: boolean;
  onProgressUpdate: (progress: number) => void;
  onBuildComplete: () => void;
  onOpenChat: () => void;
  templateMatch?: any | null;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface BuildSession {
  build_id: string;
  state: string;
  original_prompt: string;
  db_connection_string?: string;
  uploaded_file_paths?: string[];
  agent_config: any;
  history: any[];
  ui_request?: {
    type: string;
    data?: any;
  };
}

// Custom Node Component
const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-1 min-w-[60px] max-w-[60px]">
      <div className="flex flex-col items-center">
        {data.isLoading ? (
          <div className="w-6 h-6 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
            <HashLoader size={12} color="#6B7280" />
          </div>
        ) : (
          <div className="w-6 h-6 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            {data.type === 'memory' ? (
              <Brain className="w-4 h-4 text-purple-500" />
            ) : data.type === 'openai' ? (
              <img src={data.icon} alt={data.label} className="w-4 h-3" />
            ) : (
              <img src={data.icon} alt={data.label} className="w-4 h-4" />
            )}
          </div>
        )}
        <p className="text-[10px] text-gray-600 mt-1 font-medium text-center leading-tight">{data.label}</p>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Custom Edge Component
const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: any) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
    </>
  );
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export function BuildView({
  userPrompt,
  isBuilding,
  buildProgress,
  isAgentReady,
  onProgressUpdate,
  onBuildComplete,
  onOpenChat,
  templateMatch
}: BuildViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidthPx, setLeftWidthPx] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [buildSession, setBuildSession] = useState<BuildSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showThinking, setShowThinking] = useState(true);
  const [showProjectPlan, setShowProjectPlan] = useState(false);
  const [projectApproved, setProjectApproved] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState({
    hostname: '',
    username: '',
    password: '',
    database: '',
    port: '5432'
  });
  const [showDatabaseChat, setShowDatabaseChat] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [projectPlanText, setProjectPlanText] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [waitingForClarification, setWaitingForClarification] = useState(false);
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [agentConfig, setAgentConfig] = useState<AgentConfiguration | null>(null);
  const [savedAgentId, setSavedAgentId] = useState<number | null>(null);
  const [missingPrerequisites, setMissingPrerequisites] = useState<string[]>([]);
  const [showKnowledgeBaseModal, setShowKnowledgeBaseModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showNewLeadConfig, setShowNewLeadConfig] = useState(false);
  const [showCallLeadConfig, setShowCallLeadConfig] = useState(false);
  const [showPitchConfig, setShowPitchConfig] = useState(false);
  const [showCalendarConfig, setShowCalendarConfig] = useState(false);
  const [showNextStepPanel, setShowNextStepPanel] = useState(false);
  const [showAddActionModal, setShowAddActionModal] = useState(false);
  const [showConditionBox, setShowConditionBox] = useState(false);
  const [showActionBox, setShowActionBox] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showSelectActionModal, setShowSelectActionModal] = useState(false);
  const [showActionConfigPanel, setShowActionConfigPanel] = useState(false);
  const [showActionContextMenu, setShowActionContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  // Reset workflow boxes when starting a new build or when needed
  const resetWorkflowBoxes = () => {
    setShowConditionBox(false);
    setShowActionBox(false);
    setSelectedAction(null);
    setShowActionConfigPanel(false);
    setShowActionContextMenu(false);
  };

  // Reset workflow boxes when build starts or when userPrompt changes
  useEffect(() => {
    if (userPrompt && isBuilding) {
      resetWorkflowBoxes();
    }
  }, [userPrompt, isBuilding]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionContextMenu) {
        // Check if click is outside the context menu
        const target = event.target as HTMLElement;
        if (!target.closest('[data-context-menu]')) {
          setShowActionContextMenu(false);
        }
      }
    };

    if (showActionContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showActionContextMenu]);

  // Get action name for display
  const getActionName = (actionId: string) => {
    const actions = [
      { id: 'google-calendar', name: 'Google Calendar' },
      { id: 'hubspot', name: 'HubSpot' },
      { id: 'slack', name: 'Slack' },
      { id: 'gmail', name: 'Gmail' },
      { id: 'outlook', name: 'Microsoft Outlook' },
      { id: 'telegram', name: 'Telegram' },
      { id: 'lindy-computer', name: 'Lindy Computer' },
      { id: 'lindy-utilities', name: 'Lindy Utilities' },
      { id: 'run-code', name: 'Run Code' },
      { id: 'http', name: 'HTTP' },
      { id: 'agent-step', name: 'Agent Step' },
      { id: 'knowledge-base', name: 'Knowledge Base' },
      { id: 'ai-generic', name: 'AI' },
      { id: 'condition', name: 'Condition' },
      { id: 'enter-loop', name: 'Enter Loop' },
      { id: 'linkedin', name: 'LinkedIn' },
      { id: 'youtube', name: 'YouTube' },
      { id: 'lindy-phone', name: 'Lindy Phone' },
      { id: 'chat-agent', name: 'Chat with this Agent' }
    ];
    return actions.find(action => action.id === actionId)?.name || actionId;
  };
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [canvasOffset, setCanvasOffset] = useState(0);
  const [rightPanelOffset, setRightPanelOffset] = useState(0);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const newLeadConfigRef = useRef<HTMLDivElement>(null);
  const callLeadConfigRef = useRef<HTMLDivElement>(null);
  const calendarConfigRef = useRef<HTMLDivElement>(null);
  const pitchConfigRef = useRef<HTMLDivElement>(null);
  const nextStepPanelRef = useRef<HTMLDivElement>(null);

  // Database chat state
  const [databaseMessages, setDatabaseMessages] = useState<ChatMessage[]>([]);
  const [databaseInput, setDatabaseInput] = useState('');
  const [isDatabaseThinking, setIsDatabaseThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState<'thinking' | 'extracting' | 'consolidating' | null>(null);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Debug edges
  useEffect(() => {
    console.log('Current edges:', edges);
  }, [edges]);

  const buildSteps = [
    'Finalizing architecture...',
    'Setting up integrations...',
    'Generating agent logic...',
    'Configuring workflows...',
    'Finalizing deployment...'
  ];

  // Generate dynamic agent success message based on analysis
  const generateAgentSuccessMessage = () => {
    if (!agentConfig) return "Your AI agent is ready! You can now test and deploy it.";
    
    const connections = agentConfig.prerequisites?.oauth || [];
    
    // Determine agent type based on connections and template
    let agentType = "AI";
    let capabilities = [];
    
    if (connections.includes('gmail') || connections.includes('google')) {
      agentType = "Email Management";
      capabilities = ["Gmail integration", "email automation"];
    } else if (connections.includes('slack')) {
      agentType = "Communication";
      capabilities = ["Slack integration", "team collaboration"];
    } else if (connections.includes('jira')) {
      agentType = "Project Management";
      capabilities = ["Jira integration", "issue tracking"];
    } else if (agentConfig.tools_to_activate && agentConfig.tools_to_activate.includes('supabase_query')) {
      agentType = "Database";
      capabilities = ["database queries", "data analysis"];
    } else {
      agentType = "General Purpose AI";
      capabilities = connections.length > 0 ? connections : ["intelligent conversation"];
    }
    
    const capabilityText = capabilities.length > 0 
      ? ` with ${capabilities.join(", ")} capabilities` 
      : "";
    
    return `Your ${agentType} agent is ready! You can now test it${capabilityText} and start leveraging its features.`;
  };

  // Phase 2: Start a new build session when the component mounts with a prompt
  useEffect(() => {
    if (!userPrompt || buildSession) return; // Only run once when prompt is available

    const startBuild = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/builds`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userPrompt }),
        });
        if (!response.ok) throw new Error("Failed to start build session");
        
        const session: BuildSession = await response.json();
        setBuildSession(session);
      } catch (error) {
        console.error("Error starting build session:", error);
        // Handle error state in UI
      }
    };

    startBuild();
  }, [userPrompt]);

  useEffect(() => {
    if (userPrompt) {
      setChatMessages([
        {
          id: `user-${Date.now()}`,
          type: 'user',
          content: userPrompt,
          timestamp: new Date(),
        },
      ]);
    }
  }, [userPrompt]);

  // Phase 2: React to state changes from the build session
  useEffect(() => {
    if (!buildSession) return;

    // Get the latest thought from the architect
    const lastMessage = buildSession.history[buildSession.history.length - 1]?.message_to_user;

    // Update chat messages with the architect's thoughts
    if (lastMessage) {
      setChatMessages(prev => {
        // Avoid adding duplicate messages
        if (prev[prev.length - 1]?.content !== lastMessage) {
          return [...prev, {
            id: `agent-${Date.now()}`,
            type: 'agent',
            content: lastMessage,
            timestamp: new Date()
          }];
        }
        return prev;
      });
    }

    // Handle UI requests from the architect
    if (buildSession.ui_request) {
      switch (buildSession.ui_request.type) {
        case 'REQUEST_DB_CREDENTIALS':
          setShowConnectionModal(true);
          break;
        // Add other UI request handlers here
      }
    }

    // Handle the state from the architect
    switch (buildSession.state) {
      case 'WAITING_FOR_USER_INPUT':
        setShowThinking(false);
        // Allow user to type
        break;
      case 'CONFIGURATION_PROPOSED':
        setShowThinking(false);
        // Display proposed config and wait for approval/feedback
        break;
      case 'CONFIGURATION_FINALIZED':
        setShowThinking(false);
        setAgentConfig(buildSession.agent_config);
        setShowArchitecture(true);
        // The agent is now configured, and we can save it.
        saveAgentConfig(buildSession.agent_config);
        onProgressUpdate(0);
        break;
      case 'FAILED':
        setShowThinking(false);
        // Show an error message
        break;
      case 'REQUEST_DB_CREDENTIALS':
        setShowConnectionModal(true);
        break;
      case 'COMPLETED':
        // The agent is built, we can proceed to the build animation
        setShowConnectionModal(false);
        setAgentConfig(buildSession.agent_config);
        setSavedAgentId(buildSession.agent_config.id); // Assuming the final config has an ID
        setShowArchitecture(true);
        onProgressUpdate(0);
        break;
      case 'DB_CONNECTION_FAILED':
        // Show an error in the modal (a real implementation would have better UI)
        alert("Database connection failed. Please check your credentials and try again.");
        setShowConnectionModal(true); // Keep the modal open
        break;
      // TODO: Add cases for REQUEST_CSV_FILE etc.
    }

  }, [buildSession]);

  // Test n8n connection on mount
  /*
  useEffect(() => {
    const testN8nConnection = async () => {
      try {
        setN8nConnectionStatus('checking');
        const isConnected = await n8nIntegrationService.testConnection();
        const instanceInfo = await n8nIntegrationService.getInstanceInfo();
        
        setN8nConnectionStatus(isConnected ? 'connected' : 'disconnected');
        setN8nInstanceInfo(instanceInfo);
      } catch (error) {
        console.error('Failed to test n8n connection:', error);
        setN8nConnectionStatus('disconnected');
      }
    };

    testN8nConnection();
  }, []);
  */

  // Perform LLM analysis
  const performLLMAnalysis = async () => {
    try {
      console.log('Performing LLM analysis...');
      const result = await workflowAnalysisService.analyzeUserPrompt(userPrompt);
      
      console.log('LLM analysis completed:', result);
      setAnalysisResult(result);
      setProjectPlanText(result.projectPlan);
      setLogs(result.logs);
      
      // Store analysis in memory
      conversationMemoryService.storeAnalysisResult({
        prompt: userPrompt,
        analysis: result.analysis,
        requirements: result.analysis.requirements,
        strategy: result.analysis.requirements.strategy || '',
        clarifications: result.analysis.requirements.clarifications || [],
        userResponses: {},
        timestamp: new Date()
      });
      
      // Check if LLM needs clarification
      if (result.analysis.needsClarification && result.analysis.suggestedQuestions) {
        setClarificationQuestions(result.analysis.suggestedQuestions);
        setWaitingForClarification(true);
        return;
      }
      
      // Show project plan immediately
      setShowThinking(false);
      setShowProjectPlan(true);
      setTypingText('');
      setCurrentTypingIndex(0);
      
    } catch (error) {
      console.error('LLM analysis failed:', error);
      // Fail-safe to stop indefinite thinking
      setShowThinking(false);
    }
  };

  // Typing effect for project plan
  useEffect(() => {
    if (showProjectPlan && currentTypingIndex < projectPlanText.length) {
      const timer = setTimeout(() => {
        setTypingText(projectPlanText.slice(0, currentTypingIndex + 1));
        setCurrentTypingIndex(currentTypingIndex + 1);
      }, 1); // Ultra fast typing animation

      return () => clearTimeout(timer);
    }
  }, [showProjectPlan, currentTypingIndex, projectPlanText]);

  // Add project plan message when typing is complete
  useEffect(() => {
    if (showProjectPlan && currentTypingIndex === projectPlanText.length) {
      setChatMessages(prev => {
        const exists = prev.some(msg => msg.content.includes('I\'ll help you build'));
        if (!exists) {
          return [...prev, {
            id: `plan-${Date.now()}`,
            type: 'agent',
            content: projectPlanText,
            timestamp: new Date()
          }];
        }
        return prev;
      });
    }
  }, [showProjectPlan, currentTypingIndex, projectPlanText]);

  const canApprove = showProjectPlan && currentTypingIndex === projectPlanText.length;

  // Handle project approval and start architecture
  const handleProjectApproval = async () => {
    if (!canApprove) return;
    setProjectApproved(true);
    setShowProjectPlan(false);
    setShowArchitecture(true);
    
    // Add approval message
    setChatMessages(prev => [...prev, {
      id: `approve-${Date.now()}`,
      type: 'user',
      content: 'Yes, please proceed with the build!',
      timestamp: new Date()
    }]);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/agents/architect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get agent configuration from architect');
      }

      const config: AgentConfiguration = await response.json();
      setAgentConfig(config);
      console.log("Received agent config:", config);

      // NEW LOGIC: Check for database credentials prerequisite
      if (config.prerequisites.database_credentials) {
        console.log("Agent requires database credentials. Showing connection modal.");
        setShowConnectionModal(true);
        // We stop here and wait for the user to submit credentials.
        // The rest of the agent creation process will be handled by the modal's submit function.
        return;
      }

      // Save the agent configuration to the database
      try {
        const agentData = {
          user_email: "fahadpatel5700@gmail.com", // Replace with actual logged-in user email
          name: config.agent_name || "New Agent",
          system_prompt: config.system_prompt || "You are a helpful assistant.",
          configuration: {
            tools_to_activate: config.tools_to_activate || [],
            prerequisites: config.prerequisites || {},
            llm_model: config.llm_model || "gpt-4o",
            pinecone_index_name: config.prerequisites?.pinecone_index_name || null
          }
        };

        const saveResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/agents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agentData),
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save agent configuration');
        }

        const savedAgent = await saveResponse.json();
        setSavedAgentId(savedAgent.id);
        console.log("Agent saved with ID:", savedAgent.id);

        // Transition to build animation
        setShowArchitecture(true);
        onProgressUpdate(0); // This will trigger the building state
      } catch(error) {
        console.error("Error saving agent:", error);
        // Handle UI error state
        return;
      }

      // Start architecture animation sequence based on analysis result immediately
      if (templateMatch && templateMatch.template) {
        // Use template-based architecture
        // generateTemplateBasedArchitecture(templateMatch.template);
      } else {
        // Use generic connection-based architecture
        generateGenericArchitecture(config.prerequisites.oauth || []);
      }
    } catch (error) {
      console.error("Error fetching agent configuration:", error);
      // Handle error state in UI
    }

    // Animate nodes loading and connecting immediately
    setNodes(prev => prev.map(node => ({ ...node, data: { ...node.data, isLoading: false } })));

    // Add connections immediately
    const newEdges: any[] = [];
    const nodeIds = nodes.map(n => n.id);
    
    // Connect all nodes to OpenAI
    nodeIds.forEach(nodeId => {
      if (nodeId !== 'openai') {
        newEdges.push({
          id: `${nodeId}-openai`,
          source: nodeId,
          target: 'openai',
          type: 'custom',
          style: { stroke: '#6B7280', strokeWidth: 3 }
        });
      }
    });

    // Connect all nodes to memory
    nodeIds.forEach(nodeId => {
      if (nodeId !== 'memory') {
        newEdges.push({
          id: `${nodeId}-memory`,
          source: nodeId,
          target: 'memory',
          type: 'custom',
          style: { stroke: '#6B7280', strokeWidth: 3 }
        });
      }
    });

    setEdges(newEdges);

    // Start building immediately after architecture is complete
    // onProgressUpdate(0); // This is now handled after saving the agent
  };

  // Building progress effect
  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        const newProgress = buildProgress + (100 / buildSteps.length / 10);
        if (newProgress >= 100) {
          clearInterval(interval);
          onBuildComplete();
          onProgressUpdate(100);
        } else {
          onProgressUpdate(newProgress);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isBuilding, buildProgress, onProgressUpdate, onBuildComplete, buildSteps.length]);

  // Add completion message
  useEffect(() => {
    if (isAgentReady) {
      console.log('Agent is ready, current messages:', chatMessages);
      setChatMessages(prev => {
        const exists = prev.some(msg => msg.content.includes('Agent built successfully'));
        console.log('Checking if completion message exists:', exists);
        if (!exists) {
          const newMessages: ChatMessage[] = [...prev, {
            id: Date.now().toString(),
            type: 'agent' as const,
            content: generateAgentSuccessMessage(),
            timestamp: new Date()
          }];
          console.log('Adding completion message, new messages:', newMessages);
          return newMessages;
        }
        return prev;
      });
    }
  }, [isAgentReady, agentConfig]);

  const currentStepIndex = Math.floor((buildProgress / 100) * buildSteps.length);

  // Handle clarification responses
  // const handleClarificationResponse = async (responses: { [question: string]: string }) => {
  //   setWaitingForClarification(false);
    
  //   // Re-analyze with user responses
  //   const updatedPrompt = `${userPrompt}\n\nUser clarifications:\n${Object.entries(responses).map(([q, a]) => `${q}: ${a}`).join('\n')}`;
    
  //   try {
  //     const result = await workflowAnalysisService.analyzeUserPrompt(updatedPrompt);
  //     setAnalysisResult(result);
  //     setProjectPlanText(result.projectPlan);
  //     setLogs([...logs, ...result.logs]);
      
  //     // Show project plan immediately
  //     setShowThinking(false);
  //     setShowProjectPlan(true);
  //     setTypingText('');
  //     setCurrentTypingIndex(0);
  //   } catch (error) {
  //     console.error('Re-analysis failed:', error);
  //   }
  // };

  // Handle chat message submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && buildSession) {
      const userMessageContent = newMessage.trim();
      const userMessage = {
        id: `user-${Date.now()}`,
        type: 'user' as const,
        content: userMessageContent,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setShowThinking(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/builds/${buildSession.build_id}/continue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputs: {
              message: userMessageContent,
            }
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to continue build session");
        }

        const updatedSession: BuildSession = await response.json();
        setBuildSession(updatedSession);

      } catch (error) {
        console.error("Error continuing build session:", error);
        // Handle error in UI
      }
    }
  };

  // Handle follow-up questions
  const handleFollowUpQuestion = async (followUpMessage: string) => {
    try {
      // Get conversation context for follow-up
      // const context = conversationMemoryService.getFollowUpContext(followUpMessage);
      
      // Analyze with context
      const result = await llmService.analyzePrompt(followUpMessage, true);
      
      // Store analysis in memory
      conversationMemoryService.storeAnalysisResult({
        prompt: followUpMessage,
        analysis: result,
        requirements: result.requirements,
        strategy: result.requirements.strategy || '',
        clarifications: result.requirements.clarifications || [],
        userResponses: {},
        timestamp: new Date()
      });

      // Add agent response
      const agentMessage = {
        id: `agent-followup-${Date.now()}`,
        type: 'agent' as const,
        content: `Based on our previous conversation, here's what I understand about your follow-up request:\n\n${result.requirements.strategy || 'I\'ll help you with that.'}`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, agentMessage]);
      
      // Store agent response in memory
      conversationMemoryService.addConversationEntry({
        type: 'agent',
        content: agentMessage.content
      });

    } catch (error) {
      console.error('Failed to handle follow-up question:', error);
    }
  };

  // Handle new requests
  const handleNewRequest = async (newRequest: string) => {
    try {
      // Clear previous analysis state
      setAnalysisResult(null);
      setProjectPlanText('');
      setShowThinking(true);
      setShowProjectPlan(false);
      
      // Perform new analysis
      const result = await workflowAnalysisService.analyzeUserPrompt(newRequest);
      setAnalysisResult(result);
      setProjectPlanText(result.projectPlan);
      setLogs(result.logs);
      
      // Store analysis in memory
      conversationMemoryService.storeAnalysisResult({
        prompt: newRequest,
        analysis: result.analysis,
        requirements: result.analysis.requirements,
        strategy: result.analysis.requirements.strategy || '',
        clarifications: result.analysis.requirements.clarifications || [],
        userResponses: {},
        timestamp: new Date()
      });

      // Show project plan immediately
      setShowThinking(false);
      setShowProjectPlan(true);
      setTypingText('');
      setCurrentTypingIndex(0);
      
    } catch (error) {
      console.error('Failed to handle new request:', error);
    }
  };

  // Handle clarification answer
  const handleClarificationAnswer = async (answer: string) => {
    const currentQuestion = clarificationQuestions[currentQuestionIndex];
    
    // Add the question and answer to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `clarification-${currentQuestionIndex}`,
        type: 'agent' as const,
        content: `To better understand your requirements, I need to know: ${currentQuestion}`,
        timestamp: new Date()
      },
      {
        id: `answer-${currentQuestionIndex}`,
        type: 'user' as const,
        content: answer,
        timestamp: new Date()
      }
    ]);

    // Store the answer
    const responses = { [currentQuestion]: answer };
    
    // Move to next question or complete
    if (currentQuestionIndex + 1 < clarificationQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, re-analyze
      setWaitingForClarification(false);
      setCurrentQuestionIndex(0);
      
      // Re-analyze with all responses
      const allResponses = { ...responses };
      const updatedPrompt = `${userPrompt}\n\nUser clarifications:\n${Object.entries(allResponses).map(([q, a]) => `${q}: ${a}`).join('\n')}`;
      
      try {
        const result = await workflowAnalysisService.analyzeUserPrompt(updatedPrompt);
        setAnalysisResult(result);
        setProjectPlanText(result.projectPlan);
        setLogs([...logs, ...result.logs]);
        
        // Show project plan immediately
        setShowThinking(false);
        setShowProjectPlan(true);
        setTypingText('');
        setCurrentTypingIndex(0);
      } catch (error) {
        console.error('Re-analysis failed:', error);
      }
    }
  };

  // Template validation function
  /*
  const validateTemplateStructure = (template: any, fileName: string) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check basic structure
    if (!template || typeof template !== 'object') {
      errors.push('Template is not a valid object');
      return { isValid: false, errors, warnings };
    }
    
    // Check for required top-level properties
    if (!template.nodes || !Array.isArray(template.nodes)) {
      errors.push('Template missing nodes array');
    } else if (template.nodes.length === 0) {
      warnings.push('Template has no nodes');
    }
    
    if (!template.connections || typeof template.connections !== 'object') {
      errors.push('Template missing connections object');
    }
    
    // Validate nodes
    if (template.nodes && Array.isArray(template.nodes)) {
      template.nodes.forEach((node: any, index: number) => {
        if (!node.id) {
          errors.push(`Node ${index} missing id`);
        }
        if (!node.name) {
          warnings.push(`Node ${index} missing name`);
        }
        if (!node.type) {
          errors.push(`Node ${index} missing type`);
        }
        if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
          warnings.push(`Node ${index} has invalid position`);
        }
      });
    }
    
    // Check for credential nodes and their structure
    const credentialNodes = template.nodes?.filter((node: any) => 
      node.credentials && Object.keys(node.credentials).length > 0
    ) || [];
    
    if (credentialNodes.length > 0) {
      console.log(`🔍 [TEMPLATE VALIDATION] Found ${credentialNodes.length} nodes with credentials`);
      credentialNodes.forEach((node: any) => {
        const nodeCredentials = Object.keys(node.credentials);
        console.log(`🔍 [TEMPLATE VALIDATION] Node ${node.name} requires credentials:`, nodeCredentials);
      });
    }
    
    // Validate connections structure
    if (template.connections) {
      const nodeIds = new Set(template.nodes?.map((n: any) => n.name) || []);
      Object.keys(template.connections).forEach(sourceNode => {
        if (!nodeIds.has(sourceNode)) {
          warnings.push(`Connection references unknown source node: ${sourceNode}`);
        }
        
        const connections = template.connections[sourceNode];
        if (connections.main && Array.isArray(connections.main)) {
          connections.main.forEach((connGroup: any, groupIndex: number) => {
            if (Array.isArray(connGroup)) {
              connGroup.forEach((conn: any, connIndex: number) => {
                if (!conn.node || !nodeIds.has(conn.node)) {
                  warnings.push(`Connection ${sourceNode}[${groupIndex}][${connIndex}] references unknown target node: ${conn.node}`);
                }
              });
            }
          });
        }
      });
    }
    
    const isValid = errors.length === 0;
    
    return {
      isValid,
      errors,
      warnings,
      nodeCount: template.nodes?.length || 0,
      credentialNodeCount: credentialNodes.length,
      connectionCount: template.connections ? Object.keys(template.connections).length : 0
    };
  };
  */

  // Deploy workflow to n8n
  /*
  const deployWorkflow = async () => {
    if (!analysisResult) return;
    
    // Check n8n connection first
    if (n8nConnectionStatus !== 'connected') {
      setDeploymentStatus('error');
      setDeploymentMessage('n8n is not connected. Please ensure n8n is running and accessible.');
      return;
    }
    
    setDeploymentStatus('deploying');
    setDeploymentMessage('Preparing workflow deployment...');
    
    try {
      // Get OAuth tokens
      const tokens = await oauthTokenService.getValidTokensForDeployment();
      
      // Add OpenAI token from environment if needed
      if (analysisResult.requiredConnections.includes('openai')) {
        // Get OpenAI API key from environment variables (frontend first, then backend fallback)
        let openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
        
        if (!openaiKey) {
          console.log('🔍 [N8N DEPLOYMENT] OpenAI key not found in frontend env, checking backend...');
          try {
            // Try to get from backend environment
            const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/config/openai-key`);
            if (backendResponse.ok) {
              const data = await backendResponse.json();
              openaiKey = data.apiKey;
              console.log('🔑 [N8N DEPLOYMENT] Retrieved OpenAI key from backend');
            }
          } catch (error) {
            console.warn('⚠️ [N8N DEPLOYMENT] Could not retrieve OpenAI key from backend:', error);
          }
        }
        
        if (openaiKey) {
          tokens['openai'] = openaiKey;
          console.log('🔑 [N8N DEPLOYMENT] Added OpenAI token from environment variables');
        } else {
          console.warn('⚠️ [N8N DEPLOYMENT] OpenAI API key not found in environment variables');
          // Don't fail deployment, just warn - the workflow can be deployed without OpenAI node working
        }
      }
      
      // Add Pinecone token from environment if needed  
      if (analysisResult.requiredConnections.includes('pinecone')) {
        console.log('🔍 [N8N DEPLOYMENT] Pinecone integration detected, checking for API key...');
        
        let pineconeKey = import.meta.env.VITE_PINECONE_API_KEY;
        
        if (!pineconeKey) {
          console.log('🔍 [N8N DEPLOYMENT] Pinecone key not found in frontend env, checking backend...');
          try {
            // Try to get from backend environment
            const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/config/pinecone-key`);
            if (backendResponse.ok) {
              const data = await backendResponse.json();
              pineconeKey = data.apiKey;
              console.log('🔑 [N8N DEPLOYMENT] Retrieved Pinecone key from backend');
            }
          } catch (error) {
            console.warn('⚠️ [N8N DEPLOYMENT] Could not retrieve Pinecone key from backend:', error);
          }
        }
        
        if (pineconeKey) {
          tokens['pinecone'] = {
            apiKey: pineconeKey,
            environment: import.meta.env.VITE_PINECONE_ENVIRONMENT || 'us-east-1-aws'
          };
          console.log('🔑 [N8N DEPLOYMENT] Added Pinecone token from environment variables');
        } else {
          console.warn('⚠️ [N8N DEPLOYMENT] Pinecone API key not found in environment variables');
          // Don't fail deployment, just warn - Pinecone nodes may need manual configuration
        }
      }
      
      // Check if we have required tokens (excluding openai and pinecone since we handle them from env)
      const requiredOAuthConnections = analysisResult.requiredConnections.filter(conn => 
        conn !== 'openai' && conn !== 'pinecone'
      );
      const missingTokens = requiredOAuthConnections.filter(conn => !tokens[conn]);
      
      if (missingTokens.length > 0) {
        setDeploymentStatus('error');
        setDeploymentMessage(`Missing OAuth tokens for: ${missingTokens.join(', ')}. Please connect these services first.`);
        return;
      }
      
      let workflowTemplate;
      
      if (templateMatch && templateMatch.template) {
        // Use existing template
        setDeploymentMessage('Using existing template for deployment...');
        
        // Check if we have the actual template data, if not, load it using the template ID
        if (templateMatch.template.template) {
          workflowTemplate = templateMatch.template.template;
        } else {
          console.log('🔄 [N8N DEPLOYMENT] Template data missing, loading from backend API...');
          try {
            const templateId = templateMatch.template.id;
            const templateName = templateMatch.template.name;
            console.log('🔄 [N8N DEPLOYMENT] Loading template by ID:', templateId);
            console.log('🔄 [N8N DEPLOYMENT] Template name:', templateName);
            
            // Use the new template service to fetch content by ID
            workflowTemplate = await templateService.getTemplateContentById(templateId);
            
            console.log('✅ [N8N DEPLOYMENT] Successfully loaded template via API:', {
              templateId,
              templateName,
              hasNodes: !!workflowTemplate.nodes,
              nodeCount: workflowTemplate.nodes?.length || 0,
              hasConnections: !!workflowTemplate.connections
            });
            
          } catch (error) {
            console.error('❌ [N8N DEPLOYMENT] Failed to load template via API:', error);
            // Fallback to generating a new template
            setDeploymentMessage('Template loading failed, generating new workflow...');
            workflowTemplate = await llmService.generateWorkflowTemplate(analysisResult.analysis.requirements);
          }
        }
        
        console.log('🚀 [N8N DEPLOYMENT] Using existing template for deployment');
        console.log('🚀 [N8N DEPLOYMENT] Template name:', templateMatch.template.name);
        console.log('🚀 [N8N DEPLOYMENT] Template ID:', templateMatch.template.id);
        console.log('🚀 [N8N DEPLOYMENT] Template nodes count:', workflowTemplate?.nodes?.length || 0);
        console.log('🚀 [N8N DEPLOYMENT] Template connections:', Object.keys(workflowTemplate?.connections || {}));
        console.log('🚀 [N8N DEPLOYMENT] Full template data being deployed:', workflowTemplate);
      } else {
        // Generate new workflow template
        setDeploymentMessage('Generating n8n workflow template...');
        workflowTemplate = await llmService.generateWorkflowTemplate(analysisResult.analysis.requirements);
        
        console.log('🚀 [N8N DEPLOYMENT] Generated new workflow template');
        console.log('🚀 [N8N DEPLOYMENT] Generated template:', workflowTemplate);
      }
      
      // Validate template structure after loading
      if (!workflowTemplate) {
        throw new Error('Failed to load workflow template - template is null or undefined');
      }
      
      if (!workflowTemplate.nodes || !Array.isArray(workflowTemplate.nodes)) {
        throw new Error('Invalid template structure - missing or invalid nodes array');
      }
      
      if (workflowTemplate.nodes.length === 0) {
        console.warn('⚠️ [N8N DEPLOYMENT] Template has no nodes - this may cause deployment issues');
      }
      
      if (!workflowTemplate.connections || typeof workflowTemplate.connections !== 'object') {
        console.warn('⚠️ [N8N DEPLOYMENT] Template missing connections object - using empty connections');
        workflowTemplate.connections = {};
      }
      
      console.log('✅ [N8N DEPLOYMENT] Template validation passed:', {
        nodeCount: workflowTemplate.nodes.length,
        hasConnections: Object.keys(workflowTemplate.connections).length > 0,
        hasSettings: !!workflowTemplate.settings,
        templateKeys: Object.keys(workflowTemplate)
      });
      
      // Add Google OAuth token for Google nodes if needed (after template is loaded)
      const hasGoogleNodes = workflowTemplate && (
        JSON.stringify(workflowTemplate).includes('gmail') ||
        JSON.stringify(workflowTemplate).includes('googleDrive') ||
        JSON.stringify(workflowTemplate).includes('gmailOAuth2') ||
        JSON.stringify(workflowTemplate).includes('googleDriveOAuth2Api') ||
        workflowTemplate.nodes?.some((node: any) => 
          node.type === 'n8n-nodes-base.gmail' || 
          node.type === 'n8n-nodes-base.googleDrive' ||
          (node.credentials && (
            node.credentials.gmailOAuth2 || 
            node.credentials.googleDriveOAuth2Api ||
            node.credentials.googleOAuth2Api
          ))
        )
      );

      if (hasGoogleNodes) {
        console.log('🔍 [N8N DEPLOYMENT] Google integration detected, checking for OAuth tokens...');
        
        try {
          // Get Google OAuth token from the existing OAuth token service
          const googleToken = await oauthTokenService.getGoogleToken();
          
          if (googleToken && googleToken.accessToken) {
            tokens['google_header'] = googleToken;
            console.log('🔑 [N8N DEPLOYMENT] Added Google OAuth token for header authentication');
            console.log('🔑 [N8N DEPLOYMENT] Google token scopes:', googleToken.scopes);
          } else {
            console.warn('⚠️ [N8N DEPLOYMENT] Google OAuth token not found or invalid');
            console.warn('⚠️ [N8N DEPLOYMENT] Google nodes may not work properly without authentication');
            // Don't fail deployment, just warn - user needs to connect Google account
          }
        } catch (error) {
          console.error('❌ [N8N DEPLOYMENT] Failed to retrieve Google OAuth token:', error);
          console.warn('⚠️ [N8N DEPLOYMENT] Google nodes may not work without proper authentication');
          // Don't fail deployment, just warn
        }
      }
      
      setDeploymentMessage('Deploying workflow to n8n...');
      
      // Prepare deployment config
      const deploymentConfig: WorkflowDeploymentConfig = {
        workflowName: `${analysisResult.analysis.requirements.name}_${Date.now()}`,
        workflowData: workflowTemplate,
        credentials: {}, // Will be populated by n8n integration service
        oauthTokens: tokens,
        agentPrompts: {} // Can be populated for AI nodes
      };
      
      // Deploy to n8n
      const result = await n8nIntegrationService.deployWorkflow(deploymentConfig);
      
      if (result.success) {
        setWorkflowId(result.workflowId);
        setDeploymentStatus('success');
        setDeploymentMessage(result.message);
      } else {
        setDeploymentStatus('error');
        setDeploymentMessage(result.message);
      }
    } catch (error) {
      console.error('❌ [N8N DEPLOYMENT] Workflow deployment failed:', error);
      
      // Provide more descriptive error messages based on error type
      let errorMessage = 'Deployment failed: Unknown error';
      
      if (error instanceof Error) {
        errorMessage = `Deployment failed: ${error.message}`;
        
        // Provide specific guidance for common errors
        if (error.message.includes('workflowTemplate')) {
          errorMessage += '\n\nThis appears to be a template loading issue. Please try again or select a different template.';
        } else if (error.message.includes('credential')) {
          errorMessage += '\n\nThis appears to be a credential configuration issue. Please check your OAuth connections.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage += '\n\nThis appears to be a network connectivity issue. Please check your n8n connection.';
        }
      } else if (typeof error === 'string') {
        errorMessage = `Deployment failed: ${error}`;
      } else {
        errorMessage = `Deployment failed: ${String(error)}`;
      }
      
      console.error('❌ [N8N DEPLOYMENT] Error details:', {
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : 'No stack trace available',
        hasWorkflowTemplate: typeof workflowTemplate !== 'undefined' ? !!workflowTemplate : false,
        workflowTemplateNodeCount: typeof workflowTemplate !== 'undefined' ? (workflowTemplate?.nodes?.length || 0) : 'N/A',
        tokenKeys: Object.keys(tokens)
      });
      
      setDeploymentStatus('error');
      setDeploymentMessage(errorMessage);
    }
  };
  */

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleTestAgent = () => {
    if (savedAgentId) {
      setShowDatabaseChat(true); // Re-purposing this modal
    } else {
      console.error("No saved agent ID found to initiate chat.");
      alert("Could not start chat. Agent ID is missing.");
    }
  };

  const handleConnectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildSession) {
      console.error("Build session is missing, cannot continue.");
      alert("Error: Build session not found.");
      return;
    }

    // Show a loading or processing state in the UI
    // For now, we just log it. A real UI would show a spinner in the modal.
    console.log("Submitting credentials to the architect...");

    try {
      // 1. Construct the connection string
      const connString = `postgresql://${connectionConfig.username}:${connectionConfig.password}@${connectionConfig.hostname}:${connectionConfig.port}/${connectionConfig.database}`;

      // 2. Call the continue endpoint
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/builds/${buildSession.build_id}/continue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: {
            connection_string: connString,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to continue build process.');
      }

      const updatedSession: BuildSession = await response.json();
      
      // 3. Update the frontend's state with the new session from the backend
      // The useEffect hook that listens to `buildSession` will handle the rest (e.g., closing the modal or showing an error).
      setBuildSession(updatedSession);

    } catch (error) {
      console.error("Error continuing build process:", error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUploadEnv = () => {
    // This is a placeholder for now. 
    // In a real implementation, you would parse the .env file and call handleConnectionSubmit.
    alert("Functionality to parse .env files is not yet implemented.");
  };

  const handleDatabaseChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (databaseInput.trim() && savedAgentId) {
      const userMessageContent = databaseInput.trim();
      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: userMessageContent,
        timestamp: new Date()
      };
      setDatabaseMessages(prev => [...prev, userMessage]);
      setDatabaseInput('');
      
      // Start thinking process
      setIsDatabaseThinking(true);
      setThinkingPhase('thinking');

      try {
        const chatRequest = {
          session_id: `session_${savedAgentId}`, // Simple session management for now
          user_email: "fahadpatel5700@gmail.com", // Replace with actual logged-in user email
          message: userMessageContent,
        };

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/agents/${savedAgentId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chatRequest),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from agent");
        }

        const agentResponse = await response.json();

        const agentMessage: ChatMessage = {
          id: `agent-${Date.now()}`,
          type: 'agent',
          content: agentResponse.response,
          timestamp: new Date()
        };
        setDatabaseMessages(prev => [...prev, agentMessage]);

      } catch (error) {
        console.error("Error chatting with agent:", error);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: 'agent',
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date()
        };
        setDatabaseMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsDatabaseThinking(false);
        setThinkingPhase(null);
      }
    }
  };

  // Function to generate nodes based on a template
  /*
  const generateTemplateBasedArchitecture = (template: BackendTemplateSearchResult['template']) => {
    const newNodes: Node[] = [];
    let xOffset = 20;

    // Add OpenAI node
    newNodes.push({
      id: 'openai',
      type: 'custom',
      position: { x: xOffset, y: 20 },
      data: { 
        label: 'OpenAI', 
        icon: '/images/openai-icon.png', 
        type: 'openai',
        isLoading: true 
      }
    });
    xOffset += 100;

    // Add nodes based on template structure if available
    console.log('🔍 [ARCHITECTURE GEN] Template structure check:', {
      hasTemplate: !!template,
      hasTemplateProperty: !!(template?.template),
      hasNodes: !!(template?.template?.nodes),
      isNodesArray: Array.isArray(template?.template?.nodes),
      nodeCount: template?.template?.nodes?.length || 0
    });
    
    if (template?.template?.nodes && Array.isArray(template.template.nodes) && template.template.nodes.length > 0) {
      console.log(`🔍 [ARCHITECTURE GEN] Processing ${template.template.nodes.length} template nodes`);
      template.template.nodes.forEach((node: any) => {
        newNodes.push({
          id: node.id || `node-${xOffset}`,
          type: 'custom',
          position: { x: xOffset, y: 20 },
          data: { 
            label: node.name || node.label || 'Node', 
            icon: '/images/default-icon.png', 
            type: 'template-node',
            isLoading: true 
          }
        });
        xOffset += 100;
      });
    } else {
      // Fallback to required connections if template structure is not available
      console.log('🔍 [ARCHITECTURE GEN] Template nodes not available, using required connections fallback');
      const connections = template?.requiredConnections || [];
      console.log('🔍 [ARCHITECTURE GEN] Required connections:', connections);
      
      if (Array.isArray(connections) && connections.length > 0) {
        connections.forEach(connection => {
          newNodes.push({
            id: connection,
            type: 'custom',
            position: { x: xOffset, y: 20 },
            data: { 
              label: connection.charAt(0).toUpperCase() + connection.slice(1), 
              icon: `/images/${connection}-icon.png`, 
              type: connection,
              isLoading: true 
            }
          });
          xOffset += 100;
        });
      } else {
        console.log('🔍 [ARCHITECTURE GEN] No template nodes or required connections available');
      }
    }

    // Add memory node
    newNodes.push({
      id: 'memory',
      type: 'custom',
      position: { x: 70, y: 80 },
      data: { 
        label: 'Memory', 
        icon: '/images/memory-icon.png', 
        type: 'memory',
        isLoading: true 
      }
    });

    setNodes(newNodes);
  };
  */

  // Function to generate generic connection-based architecture
  const generateGenericArchitecture = (requiredConnections: string[]) => {
    const newNodes: Node[] = [];
    let xOffset = 20;

    // Always add OpenAI node
    newNodes.push({
      id: 'openai',
      type: 'custom',
      position: { x: xOffset, y: 20 },
      data: { 
        label: 'OpenAI', 
        icon: '/images/openai-icon.png', 
        type: 'openai',
        isLoading: true 
      }
    });
    xOffset += 100;

    // Add connection-specific nodes
    if (requiredConnections.includes('google')) {
      newNodes.push({
        id: 'google',
        type: 'custom',
        position: { x: xOffset, y: 20 },
        data: { 
          label: 'Google', 
          icon: '/images/google-icon.png', 
          type: 'google',
          isLoading: true 
        }
      });
      xOffset += 100;
    }

    if (requiredConnections.includes('jira')) {
      newNodes.push({
        id: 'jira',
        type: 'custom',
        position: { x: xOffset, y: 20 },
        data: { 
          label: 'Jira', 
          icon: '/images/jira-icon.png', 
          type: 'jira',
          isLoading: true 
        }
      });
      xOffset += 100;
    }

    if (requiredConnections.includes('slack')) {
      newNodes.push({
        id: 'slack',
        type: 'custom',
        position: { x: xOffset, y: 20 },
        data: { 
          label: 'Slack', 
          icon: '/images/slack-icon.png', 
          type: 'slack',
          isLoading: true 
        }
      });
      xOffset += 100;
    }

    // Add memory node
    newNodes.push({
      id: 'memory',
      type: 'custom',
      position: { x: 70, y: 80 },
      data: { 
        label: 'Memory', 
        icon: '/images/memory-icon.png', 
        type: 'memory',
        isLoading: true 
      }
    });

    setNodes(newNodes);
  };

  const checkPrerequisites = async (config: AgentConfiguration): Promise<string[]> => {
    const unmet: string[] = [];
    // Add any additional prerequisites checks you want to execute
    return unmet;
  };

  const saveAgentConfig = async (config: AgentConfiguration) => {
    try {
      const agentData = {
        user_email: "fahadpatel5700@gmail.com", // Replace with actual logged-in user email
        name: config.agent_name || "New Agent",
        system_prompt: config.system_prompt || "You are a helpful assistant.",
        configuration: {
          tools_to_activate: config.tools_to_activate || [],
          prerequisites: config.prerequisites || {},
          llm_model: config.llm_model || "gpt-4o",
          pinecone_index_name: config.prerequisites?.pinecone_index_name || null
        }
      };

      const saveResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save agent configuration');
      }

      const savedAgent = await saveResponse.json();
      setSavedAgentId(savedAgent.id);
      console.log("Agent saved with ID:", savedAgent.id);
    } catch(error: any) {
      console.error("Error saving agent:", error);
    }
  };

  // Initialize and handle resizing of left panel
  useEffect(() => {
    const init = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      setLeftWidthPx((prev) => prev ?? Math.max(300, Math.min(containerWidth - 360, Math.round(containerWidth * 0.5))));
    };
    init();
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, []);

  // Handle horizontal scrolling for right panel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setRightPanelOffset(prev => {
          const newOffset = prev + e.deltaY * 0.5;
          return Math.max(-400, Math.min(400, newOffset));
        });
      }
    };

    let startX = 0;
    let startOffset = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startOffset = rightPanelOffset;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        const newOffset = startOffset + diffX;
        setRightPanelOffset(Math.max(-400, Math.min(400, newOffset)));
      }
    };

    const rightPanel = rightPanelRef.current;
    if (rightPanel) {
      rightPanel.addEventListener('wheel', handleWheel, { passive: false });
      rightPanel.addEventListener('touchstart', handleTouchStart, { passive: true });
      rightPanel.addEventListener('touchmove', handleTouchMove, { passive: true });
      
      return () => {
        rightPanel.removeEventListener('wheel', handleWheel);
        rightPanel.removeEventListener('touchstart', handleTouchStart);
        rightPanel.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [rightPanelOffset]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const proposed = e.clientX - rect.left;
      const minLeft = 280;
      const maxLeft = rect.width - 360;
      const clamped = Math.max(minLeft, Math.min(maxLeft, proposed));
      setLeftWidthPx(clamped);
    };
    const stop = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stop);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stop);
    };
  }, [isResizing]);

  // Handle click outside New Lead Config panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (newLeadConfigRef.current && !newLeadConfigRef.current.contains(event.target as HTMLElement)) {
        setShowNewLeadConfig(false);
      }
    };

    if (showNewLeadConfig) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewLeadConfig]);

  // Handle click outside Call Lead Config panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (callLeadConfigRef.current && !callLeadConfigRef.current.contains(event.target as HTMLElement)) {
        setShowCallLeadConfig(false);
      }
    };

    if (showCallLeadConfig) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCallLeadConfig]);

  // Handle click outside Calendar Config panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarConfigRef.current && !calendarConfigRef.current.contains(event.target as HTMLElement)) {
        setShowCalendarConfig(false);
      }
    };

    if (showCalendarConfig) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendarConfig]);

  // Handle click outside Pitch Product Config panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pitchConfigRef.current && !pitchConfigRef.current.contains(event.target as HTMLElement)) {
        setShowPitchConfig(false);
      }
    };

    if (showPitchConfig) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPitchConfig]);

  // Handle click outside Next Step Panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nextStepPanelRef.current && !nextStepPanelRef.current.contains(event.target as HTMLElement)) {
        setShowNextStepPanel(false);
      }
    };

    if (showNextStepPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNextStepPanel]);

  return (
    <div ref={containerRef} className="flex-1 flex h-screen pt-24">
      <div className="flex w-full">
      {/* Left Panel - Chat Window */}
      <div
        className="border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0"
        style={{ width: leftWidthPx ? `${leftWidthPx}px` : undefined }}
      >
        {/* Chat Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-orange-500 dark:bg-gray-600 text-white' 
                    : 'bg-transparent text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            
            {/* Thinking Animation */}
            {showThinking && (
              <div className="flex justify-start">
                <div className="max-w-md rounded-2xl px-4 py-3 bg-transparent text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Effect */}
            {showProjectPlan && currentTypingIndex < projectPlanText.length && (
              <div className="flex justify-start">
                <div className="max-w-md rounded-2xl px-4 py-3 bg-transparent text-gray-900 dark:text-white">
                  <p className="text-sm whitespace-pre-line">
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              </div>
            )}
            
            {/* Project Approval Buttons */}
            {canApprove && (
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleProjectApproval}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-[#8B5CF6]/25"
                >
                  Approve & Build
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input - Fixed at bottom */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => {
                setShowKnowledgeBaseModal(true);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Upload Documents for Knowledge Base
            </button>
          </div>
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim()) {
                    handleSendMessage(e);
                  }
                }
              }}
              placeholder="Type a message..."
              className="w-full h-32 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300"
              disabled={isBuilding || showThinking}
            />
            
            <div className="absolute bottom-4 left-4 flex space-x-2 z-20">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </div>

            {/* Send Button - appears when typing */}
            <div className={`absolute top-4 right-4 transition-all duration-300 ease-out ${
              newMessage.trim() 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-75 translate-y-2 pointer-events-none'
            }`}>
              <button
                type="submit"
                disabled={!newMessage.trim() || isBuilding || showThinking}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-[#8B5CF6]/25"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-col-resize"
        onMouseDown={() => setIsResizing(true)}
        title="Drag to resize"
      />

      {/* Right Panel - Progress/Architecture */}
      <div ref={rightPanelRef} className="flex-1 flex flex-col overflow-y-auto relative" style={{
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundColor: '#ffffff'
      }}>



        {/* New Lead Configuration Panel - Partial Overlay */}
        {showNewLeadConfig && (
          <div ref={newLeadConfigRef} className="absolute top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-10 shadow-2xl">
            <NewLeadConfigPanel onClose={() => setShowNewLeadConfig(false)} />
          </div>
        )}
        {showCallLeadConfig && (
          <div ref={callLeadConfigRef} className="absolute top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-10 shadow-2xl">
            <CallLeadConfigPanel onClose={() => setShowCallLeadConfig(false)} />
          </div>
        )}
        {showPitchConfig && (
          <div ref={pitchConfigRef} className="absolute top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-10 shadow-2xl">
            <PitchProductConfigPanel onClose={() => setShowPitchConfig(false)} />
          </div>
        )}
        {showCalendarConfig && (
          <div ref={calendarConfigRef} className="absolute top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-10 shadow-2xl">
            <CheckCalendarConfigPanel onClose={() => setShowCalendarConfig(false)} />
          </div>
        )}
        {showActionConfigPanel && (
          <div className="absolute top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-10 shadow-2xl">
            <ActionConfigPanel 
              onClose={() => setShowActionConfigPanel(false)} 
              selectedAction={selectedAction}
            />
          </div>
        )}
        {showNextStepPanel && (
          <div ref={nextStepPanelRef} className="absolute left-1/2 top-[650px] -translate-x-1/2 w-80 bg-gray-100 border border-gray-300 rounded-lg shadow-lg z-[9999]">
            <SelectNextStepPanel 
              onClose={() => setShowNextStepPanel(false)} 
              onOpenAddAction={() => setShowAddActionModal(true)}
            />
          </div>
        )}

        {/* Add Action Modal */}
        {showAddActionModal && (
          <AddActionModal 
            onClose={() => {
              setShowAddActionModal(false);
              // Always show the boxes and right panel when closing the Add Action modal
              setShowConditionBox(true);
              setShowActionBox(true);
              setShowActionConfigPanel(true);
            }} 
            onActionSelect={(actionId) => {
              setSelectedAction(actionId);
              setShowConditionBox(true);
              setShowActionBox(true);
              setShowActionConfigPanel(true);
            }}
          />
        )}

        {/* Select Action Modal */}
        {showSelectActionModal && (
          <SelectActionModal 
            onClose={() => setShowSelectActionModal(false)} 
            onActionSelect={(actionId) => {
              setSelectedAction(actionId);
            }}
          />
        )}

        {showArchitecture ? (
          // Architecture View with React Flow
          <div className="flex-1 p-6 overflow-y-auto transition-transform duration-300 ease-in-out" style={{ transform: `translateX(${rightPanelOffset}px)` }}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Building Architecture</h2>
            
            {/* AI Agent Container */}
            <div className="relative bg-white rounded-lg border-2 border-gray-200 p-6 mb-4 h-64" 
                 style={{
                   backgroundSize: '20px 20px'
                 }}>
              
              {/* React Flow Diagram */}
              <div className="h-56 w-full">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.1 }}
                  attributionPosition="bottom-left"
                  className="bg-transparent"
                  proOptions={{ hideAttribution: true }}
                  minZoom={0.5}
                  maxZoom={1.5}
                >
                  <Background color="#9ca3af" gap={20} />
                </ReactFlow>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {nodes.length === 0 
                  ? 'Analyzing requirements...' 
                  : nodes.length > 0 && edges.length === 0 
                    ? 'Connecting components...' 
                    : edges.length > 0 
                      ? 'Architecture complete! Starting build...' 
                      : 'Setting up architecture...'}
              </p>
            </div>

            {/* Build Steps - Only visible after architecture is complete and user has approved */}
            {(isBuilding || isAgentReady) && showArchitecture && projectApproved && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Build Progress</h3>
                <div className="space-y-3">
                  {buildSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {index === currentStepIndex && isBuilding ? (
                        <div className="w-6 h-6 flex items-center justify-center">
                          <HashLoader size={20} color="#8B5CF6" />
                        </div>
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${
                          index < currentStepIndex ? 'bg-orange-500 dark:bg-[#8B5CF6]' :
                          index === currentStepIndex ? 'bg-orange-400 dark:bg-[#A855F7] animate-pulse' :
                          'bg-gray-300 dark:bg-gray-600'
                        }`} />
                      )}
                      <p className={`${
                        index <= currentStepIndex ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                      } transition-colors duration-300`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Section - Fixed at bottom */}
            {isAgentReady && (
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-[#8B5CF6]/10 border border-orange-200 dark:border-[#8B5CF6]/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 dark:text-[#8B5CF6]" />
                      <div>
                        <p className="text-orange-800 dark:text-[#8B5CF6] font-medium transition-colors duration-300">Agent built successfully!</p>
                        <p className="text-orange-700 dark:text-[#A855F7] text-sm mt-1 transition-colors duration-300">
                          Your AI agent is ready for testing and deployment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleTestAgent}
                      className="w-full bg-white hover:bg-gray-50 dark:bg-white dark:hover:bg-gray-200 text-gray-900 dark:text-black px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-300"
                    >
                      <Database className="h-5 w-5" />
                      <span>Test Agent</span>
                    </button>

                    <button
                      onClick={() => alert('Agent deployed successfully!')}
                      className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Zap className="h-5 w-5" />
                      <span>Deploy Agent</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Right Panel Content for Horizontal Scrolling */}
            <div className="absolute right-[-300px] top-0 w-80 h-full bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Settings</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Workflow Settings</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configure advanced workflow options and automation rules.</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Integration Options</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage third-party integrations and API connections.</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance Metrics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monitor workflow performance and execution statistics.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Build Progress View (when architecture is hidden)
          <>
            {((isBuilding || isAgentReady) && projectApproved) ? (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Build Progress</h2>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div
                      className="bg-orange-500 dark:bg-[#8B5CF6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${buildProgress}%` }}
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{Math.round(buildProgress)}% complete</p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {buildSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {index === currentStepIndex && isBuilding ? (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <HashLoader size={20} color="#8B5CF6" />
                          </div>
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${
                            index < currentStepIndex ? 'bg-orange-500 dark:bg-[#8B5CF6]' :
                            index === currentStepIndex ? 'bg-orange-400 dark:bg-[#A855F7] animate-pulse' :
                            'bg-gray-300 dark:bg-gray-600'
                          }`} />
                        )}
                        <p className={`${
                          index <= currentStepIndex ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                        } transition-colors duration-300`}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Section - Fixed at bottom */}
                {isAgentReady && (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 dark:bg-[#8B5CF6]/10 border border-orange-200 dark:border-[#8B5CF6]/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-orange-600 dark:text-[#8B5CF6]" />
                          <div>
                            <p className="text-orange-800 dark:text-[#8B5CF6] font-medium transition-colors duration-300">Agent built successfully!</p>
                            <p className="text-orange-700 dark:text-[#A855F7] text-sm mt-1 transition-colors duration-300">
                              Your AI agent is ready for testing and deployment.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={handleTestAgent}
                          className="w-full bg-white hover:bg-gray-50 dark:bg-white dark:hover:bg-gray-200 text-gray-900 dark:text-black px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-300"
                        >
                          <Database className="h-5 w-5" />
                          <span>Test Agent</span>
                        </button>

                        <button
                          onClick={() => alert('Agent deployed successfully!')}
                          className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Zap className="h-5 w-5" />
                          <span>Deploy Agent</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto transition-transform duration-300 ease-in-out" style={{ transform: `translateX(${rightPanelOffset}px)` }}>

                
                <div className="relative w-full max-w-3xl min-h-[980px] transition-transform duration-300 ease-in-out" style={{ transform: `translateX(${canvasOffset}px)` }}>
                  {/* Connector background (subtle) */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-20 bottom-56 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* New Lead Added - top center */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-4 w-[360px]">
                    <div 
                      className={`flex items-center bg-white dark:bg-transparent border rounded-2xl px-4 py-3 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
                        showNewLeadConfig 
                          ? 'border-blue-500 dark:border-blue-400' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setShowNewLeadConfig(!showNewLeadConfig)}
                    >
                      <div className="w-7 h-7 mr-3 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center">
                        <img src="/images/google-sheets-icon.png" alt="Google Sheets" className="h-4 w-4" />
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">New Lead Added</div>
                    </div>
                  </div>


                  {/* Call Lead - below center */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[100px] w-[360px]">
                    <div 
                      className={`flex items-center bg-white dark:bg-transparent border rounded-2xl px-4 py-3 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
                        showCallLeadConfig ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setShowCallLeadConfig(!showCallLeadConfig)}
                    >
                      <div className="w-7 h-7 mr-3 rounded-lg bg-yellow-50 border border-yellow-300 flex items-center justify-center">
                        <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6v2a10 10 0 0010 10h2v-1a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2C9.163 22 2 14.837 2 6V4a2 2 0 011-1z" />
                        </svg>
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">Call Lead</div>
                    </div>
                  </div>

                  {/* Small pill: After call ends (center) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[180px]">
                    <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm shadow-sm border border-gray-200 dark:border-gray-700">After call ends</div>
                  </div>

                  {/* Horizontal dashed connector between 'After call ends' and 'After call begins' */}
                  <div className="absolute left-1/2 top-[192px] h-px w-[280px] -translate-x-0 border-t border-dashed border-gray-300 dark:border-gray-700" />

                  {/* Small pill: After call begins (right) + plus button (aligned with 'After call ends') */}
                  <div className="absolute right-8 top-[180px] flex items-center space-x-3">
                    <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm shadow-sm border border-gray-200 dark:border-gray-700">After call begins</div>
                    <div className="h-7 w-7 rounded-full bg-white dark:bg-transparent border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-500">
                      <Plus className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Pitch Product & Qualify Lead - big blue card center */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[250px] w-[360px]">
                    <div 
                      className={`relative rounded-2xl border-2 p-5 min-h-[120px] shadow-[0_0_0_4px_rgba(125,211,252,0.2)] cursor-pointer transition-all ${showPitchConfig ? 'border-blue-500 dark:border-blue-400' : 'border-sky-300 dark:border-sky-700 bg-white dark:bg-transparent'}`}
                      onClick={() => setShowPitchConfig(!showPitchConfig)}
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 mr-3 rounded-lg border-2 border-sky-400 dark:border-sky-600 flex items-center justify-center">
                          <svg className="h-4 w-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">Pitch Product & Qualify Lead</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">You are calling a lead to pitch...</div>
                          <div className="mt-2 inline-flex items-center rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-2 py-1">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-.376a1 1 0 01.894 1.447L17 17l-2-2-3 3-4-4 3-3-2-2 5.93-3.37A1 1 0 0116 6v4z" /></svg>
                            Call
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plus button near pitch card (right side) */}
                  <div className="absolute right-8 top-[305px] h-8 w-8 rounded-full bg-white dark:bg-transparent border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-500 shadow-sm">
                    <Plus className="h-4 w-4" />
                  </div>

                  {/* Pill: The agent has finished pitching... */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[410px]">
                    <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm shadow-sm border border-gray-200 dark:border-gray-700">The agent has finished pit...</div>
                  </div>

                  {/* Check Calendar Availability - left */}
                  <div className="absolute left-[-200px] top-[470px] w-[360px]">
                    <div 
                      className={`flex items-center bg-white dark:bg-transparent border rounded-2xl px-4 py-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
                        showCalendarConfig ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setShowCalendarConfig(!showCalendarConfig)}
                    >
                      <div className="w-7 h-7 mr-3 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <img src="/images/google-calendar-icon.png" alt="Google Calendar" className="h-4 w-4" />
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">Check Calendar Availability</div>
                    </div>
                  </div>

                  {/* Vertical dashed connector from agent finished pill to Lead Interested */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[430px] h-[40px] border-l border-dashed border-gray-300 dark:border-gray-700" />

                  {/* Lead Interested? - centered under agent finished pill */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[470px] w-[360px]">
                    <div className="flex items-center bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-4 shadow-sm">
                      <div className="w-7 h-7 mr-3 rounded-lg bg-purple-50 border border-purple-300 flex items-center justify-center">
                        <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">Lead Interested?</div>
                    </div>
                  </div>

                  {/* Plus button near Lead Interested (right side) */}
                  <div className="absolute right-8 top-[470px] h-8 w-8 rounded-full bg-white dark:bg-transparent border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-500 shadow-sm">
                    <Plus className="h-4 w-4" />
                  </div>

                  {/* Pill: Interested (below both top boxes, centered between them) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[540px]">
                    <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm shadow-sm border border-gray-200 dark:border-gray-700">Interested</div>
                  </div>

                  {/* Connector: from left box (Check Calendar Availability) to Interested pill */}
                  <div className="absolute left-1/2 -translate-x-[260px] top-[550px] w-[260px] border-t border-dashed border-gray-300 dark:border-gray-700" />

                  {/* Connector: from right box (Lead Interested?) to Interested pill */}
                  <div className="absolute left-1/2 translate-x-[100px] top-[550px] w-[100px] border-t border-dashed border-gray-300 dark:border-gray-700" />

                  {/* Connector: from Interested pill down to Collect Email & Book Call */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[560px] h-[60px] border-l border-dashed border-gray-300 dark:border-gray-700" />

                  {/* Connector: from Collect Email & Book Call down to Define a condition (if shown) */}
                  {showConditionBox && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[640px] h-[110px] border-l border-dashed border-gray-300 dark:border-gray-700" />
                  )}

                  {/* Connector: from Define a condition down to Select Action (if shown) */}
                  {showActionBox && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[790px] h-[60px] border-l border-dashed border-gray-300 dark:border-gray-700" />
                  )}

                  {/* Connector: from Select Action down to Plus button (if shown) */}
                  {showActionBox && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[890px] h-[90px] border-l border-dashed border-gray-300 dark:border-gray-700" />
                  )}

                  {/* Collect Email & Book Call - bottom center (match small width) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[620px] w-[360px]">
                    <div className="rounded-2xl border-2 border-sky-300 dark:border-sky-700 bg-white dark:bg-transparent shadow-[0_0_0_4px_rgba(125,211,252,0.2)] p-5">
                      <div className="flex items-start">
                        <div className="w-8 h-8 mr-3 rounded-lg border-2 border-sky-400 dark:border-sky-600 flex items-center justify-center">
                          <svg className="h-4 w-4 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">Collect Email & Book Call</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ask the lead for their email...</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Define a condition box - appears when action is selected */}
                  {showConditionBox && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[750px] w-[200px]">
                      <div className="rounded-2xl border-2 border-yellow-300 dark:border-yellow-700 bg-white dark:bg-transparent shadow-[0_0_0_4px_rgba(251,191,36,0.2)] p-4">
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 mr-2 rounded-lg border-2 border-yellow-400 dark:border-yellow-600 flex items-center justify-center">
                            <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">Define a condition</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Select Action box - appears when action is selected */}
                  {showActionBox && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[850px] w-[200px]">
                      <div 
                        className="rounded-2xl border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-transparent shadow-[0_0_0_4px_rgba(168,85,247,0.2)] p-4 cursor-pointer hover:shadow-[0_0_0_6px_rgba(168,85,247,0.3)] transition-all relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionContextMenu(!showActionContextMenu);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 mr-2 rounded-lg border-2 border-purple-400 dark:border-purple-600 flex items-center justify-center">
                              <svg className="h-4 w-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {selectedAction ? getActionName(selectedAction) : 'Select an action'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 rounded border border-yellow-400 dark:border-yellow-600 flex items-center justify-center">
                              <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            </div>
                            <span className="text-gray-400">⋯</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Context Menu for Select Action box */}
                      {showActionContextMenu && (
                        <div 
                          data-context-menu
                          className="absolute left-full top-0 ml-2 z-[10001] bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[120px]"
                        >
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setShowActionContextMenu(false);
                          // Handle rename
                          console.log('Rename action');
                        }}
                      >
                        <span className="w-4 h-4 mr-2 text-center font-bold text-gray-600">T</span>
                        Rename
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setShowActionContextMenu(false);
                          // Handle replace
                          console.log('Replace action');
                        }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        Replace
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                        onClick={() => {
                          setShowActionContextMenu(false);
                          // Handle delete
                          setShowActionBox(false);
                          setShowActionConfigPanel(false);
                          console.log('Delete action');
                        }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Delete
                      </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Plus button - positioned with more spacing from Collect Email box initially, moves down when workflow boxes appear */}
                  <div 
                    className={`absolute left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white dark:bg-transparent border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-500 shadow-sm cursor-pointer hover:bg-sky-50 transition-all duration-300 ${
                      showConditionBox || showActionBox ? 'top-[980px]' : 'top-[780px]'
                    }`}
                    onClick={() => {
                      console.log('Plus button clicked, current state:', showNextStepPanel);
                      setShowNextStepPanel(!showNextStepPanel);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </div>



                  {/* Analysis Logs - Only show during analysis phase */}
                  {logs.length > 0 && !showProjectPlan && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[780px] w-[520px]">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Analysis Logs</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {logs.slice(-5).map((log, index) => (
                          <div key={index} className="text-xs font-mono text-gray-600 dark:text-gray-400 mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>


      
      <KnowledgeBaseModal
        isOpen={showKnowledgeBaseModal}
        onClose={() => setShowKnowledgeBaseModal(false)}
        onSelectSource={(source) => {
          if (source === 'files') {
            setShowFileUploadModal(true);
          }
          console.log('Selected source:', source);
          setShowKnowledgeBaseModal(false);
        }}
      />

      <FileUploadModal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        onUpload={async (files) => {
          if (!buildSession) return;
          const formData = new FormData();
          formData.append("file", files[0]);

          try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'}/api/v1/builds/${buildSession.build_id}/upload_file`, {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error("Failed to upload file");
            }

            const updatedSession: BuildSession = await response.json();
            setBuildSession(updatedSession);
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }}
      />

      {/* PostgreSQL Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configure Database Connection</h3>
                <button
                  onClick={() => setShowConnectionModal(false)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-3">
                  <button
                    onClick={handleUploadEnv}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-[#8B5CF6] transition-colors duration-200"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload .env file</span>
                  </button>
                </div>

                <div className="text-center text-gray-500 dark:text-gray-400">or</div>

                <form onSubmit={handleConnectionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hostname</label>
                    <input
                      type="text"
                      value={connectionConfig.hostname}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, hostname: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="localhost"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input
                      type="text"
                      value={connectionConfig.username}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="postgres"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      value={connectionConfig.password}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database</label>
                    <input
                      type="text"
                      value={connectionConfig.database}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, database: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="mydatabase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
                    <input
                      type="text"
                      value={connectionConfig.port}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, port: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6]"
                      placeholder="5432"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#A855F7] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Connect to Database
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Chat Modal */}
      {showDatabaseChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Agent Chat</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">Connected</p>
                </div>
              </div>
              <button
                onClick={() => setShowDatabaseChat(false)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-md px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <p className="text-sm leading-relaxed">
                    Hi! I am your AI agent. I'm now connected and ready to help you with your tasks. Ask me anything and I'll provide you with detailed insights and assistance based on my capabilities.
                  </p>
                </div>
              </div>
              
              {/* Database Chat Messages */}
              {databaseMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Thinking Animation */}
              {isDatabaseThinking && (
                <div className="flex justify-start">
                  <div className="max-w-md rounded-2xl px-4 py-3 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        {thinkingPhase === 'thinking' && 'Thinking...'}
                        {thinkingPhase === 'extracting' && 'Extracting data...'}
                        {thinkingPhase === 'consolidating' && 'Consolidating final response...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <form onSubmit={handleDatabaseChat} className="relative">
                <textarea
                  value={databaseInput}
                  onChange={(e) => setDatabaseInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (databaseInput.trim() && !isDatabaseThinking) {
                        handleDatabaseChat(e);
                      }
                    }
                  }}
                  placeholder="Chat with your new agent..."
                  disabled={isDatabaseThinking}
                  className="w-full h-24 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute top-4 right-4">
                  <button
                    type="submit"
                    disabled={!databaseInput.trim() || isDatabaseThinking}
                    className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}