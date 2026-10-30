import React from 'react';
import Icon from './Icon.jsx';

export function Toast({ toast }) {
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-[#161E3E] text-white',
  };

  const iconNames = {
    success: 'check-circle-2',
    error: 'alert-circle',
    info: 'info',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-medium ${bgStyles[toast.type] || bgStyles.info}`}>
        <Icon name={iconNames[toast.type] || 'info'} className="w-4 h-4 shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default Toast;
