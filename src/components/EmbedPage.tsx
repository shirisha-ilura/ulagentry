import React from 'react';

const EMBED_CARDS = [
  {
    icon: <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2"><rect x="4" y="4" width="20" height="20" rx="4" stroke="#fff" strokeWidth="2"/><rect x="8" y="8" width="12" height="12" rx="2" stroke="#fff" strokeWidth="2"/><rect x="12" y="12" width="4" height="4" rx="1" stroke="#fff" strokeWidth="2"/></svg>, // Website Embed
    title: 'Website Embed (iframe)',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-gray-400',
  },
  {
    icon: <svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#25D366" strokeWidth="2"/><path d="M8 14l4 4 8-8" stroke="#25D366" strokeWidth="2"/></svg>,
    title: 'WhatsApp Chat Link',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-green-400',
  },
  {
    icon: <img src="/images/slack-icon.png" alt="Slack" className="w-7 h-7" />, // Slack
    title: 'Slack Integration',
    desc: 'Add your bot to a Slack workspace and connect commands.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-[#4A154B]',
  },
  {
    icon: <img src="/images/jira-icon.png" alt="Jira" className="w-7 h-7" />, // Jira
    title: 'Jira Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-blue-400',
  },
  {
    icon: <img src="/images/framer-icon.png" alt="Framer" className="w-7 h-7" />, // Framer
    title: 'Framer Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-purple-400',
  },
  {
    icon: <img src="/images/shopify-icon.png" alt="Shopify" className="w-7 h-7" />, // Shopify
    title: 'Shopify Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-orange-400',
  },
];

export default function EmbedPage() {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Embed Your Agent
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose from various integration options to embed your agent across different platforms.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EMBED_CARDS.map((card, i) => (
            <div
              key={i}
              className={`p-6 border-2 ${card.color} rounded-xl transition-all hover:shadow-lg hover:border-gray-500 dark:hover:border-gray-400 bg-white dark:bg-gray-800`}
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">{card.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {card.desc}
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm font-mono mb-4">
                <code className="text-gray-800 dark:text-gray-200">{card.code}</code>
              </div>
              <button
                onClick={() => copyToClipboard(card.code)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Copy Code
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 