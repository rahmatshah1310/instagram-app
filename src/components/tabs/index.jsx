import React from 'react';

const Tab = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-t border-gray-800">
      <div className="flex justify-center gap-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-4 font-medium flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-t border-white text-white'
                : 'text-gray-500'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tab;