import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../poppins.css';

const cards = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#23232a" stroke="#fff"/><rect x="6" y="6" width="12" height="12" rx="2" fill="#23232a" stroke="#fff"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#23232a" stroke="#fff"/></svg>
    ),
    title: 'Website Embed (iframe)',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.366.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/></svg>
    ),
    title: 'WhatsApp Chat Link',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
  },
  {
    icon: (
      <img src="/images/slack-icon.png" alt="Slack" className="w-7 h-7" />
    ),
    title: 'Slack Integration',
    desc: 'Add your bot to a Slack workspace and connect commands to start a conversation.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
  },
  {
    icon: (
      <img src="/images/jira-icon.png" alt="Jira" className="w-7 h-7" />
    ),
    title: 'Jira Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
  },
  {
    icon: (
      <img src="/images/framer-icon.png" alt="Framer" className="w-7 h-7" />
    ),
    title: 'Framer Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
  },
  {
    icon: (
      <img src="/images/shopify-icon.png" alt="Shopify" className="w-7 h-7" />
    ),
    title: 'Shopify Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
  },
];

export function Embed() {
  const { resolvedTheme } = useTheme();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="pt-24 pb-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Embed Your Agent
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from various integration options to embed your agent across different platforms.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => {
          // Highlight the Website Embed card
          const isWebsiteEmbed = idx === 0;
          
          return (
            <div
              key={idx}
              className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
                resolvedTheme === 'dark'
                  ? isWebsiteEmbed 
                    ? 'bg-purple-900/20 ring-1 ring-purple-500/30' 
                    : 'bg-gray-800/50 hover:bg-gray-800/70'
                  : isWebsiteEmbed 
                    ? 'bg-orange-50 ring-1 ring-orange-200' 
                    : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="mr-3">{card.icon}</div>
                <h3 
                  className="font-semibold text-gray-900 dark:text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {card.title}
                </h3>
              </div>
              <p 
                className="text-sm text-gray-600 dark:text-gray-300 mb-4"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {card.desc}
              </p>
              <div className={`p-3 rounded-lg text-xs font-mono mb-4 ${
                resolvedTheme === 'dark' 
                  ? 'bg-gray-900/70 text-gray-200 border border-gray-700' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <code>{card.code}</code>
              </div>
              <button
                onClick={() => copyToClipboard(card.code)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  resolvedTheme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                Copy Code
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 