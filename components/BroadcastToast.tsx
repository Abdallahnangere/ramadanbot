import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface BroadcastMessage {
  id: string;
  message: string;
  action_text?: string;
  action_url?: string;
  created_at: string;
}

interface BroadcastToastProps {
  messages: BroadcastMessage[];
  onDismiss?: (id: string) => void;
}

export default function BroadcastToast({ messages, onDismiss }: BroadcastToastProps) {
  const [visibleMessages, setVisibleMessages] = useState<BroadcastMessage[]>(messages);

  useEffect(() => {
    setVisibleMessages(messages);
  }, [messages]);

  const handleDismiss = (id: string) => {
    setVisibleMessages(prev => prev.filter(m => m.id !== id));
    onDismiss?.(id);
  };

  if (visibleMessages.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 space-y-3 max-w-md">
      {visibleMessages.map((msg) => (
        <div
          key={msg.id}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-up"
        >
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug break-words">
              {msg.message}
            </p>
            {msg.action_text && msg.action_url && (
              <a
                href={msg.action_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded font-semibold transition-all"
              >
                {msg.action_text}
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => handleDismiss(msg.id)}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss message"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
