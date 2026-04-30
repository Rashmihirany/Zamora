'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: '✨ New Arrivals', message: 'Show me your latest arrivals' },
  { label: '🖤 Style Me', message: 'I need help finding the perfect outfit' },
  { label: '📦 Shipping', message: 'Tell me about your delivery options' },
  { label: '📏 Sizing', message: 'Help me find my perfect size' },
];

// Simple markdown-like renderer for bold and links
function renderMessageText(text: string) {
  const parts: (string | JSX.Element)[] = [];
  // Split by lines first for line breaks
  const lines = text.split('\n');

  lines.forEach((line, lineIdx) => {
    // Process bold and links
    const regex = /(\*\*(.+?)\*\*)|(\[(.+?)\]\((.+?)\))/g;
    let lastIndex = 0;
    let match;
    const lineElements: (string | JSX.Element)[] = [];

    while ((match = regex.exec(line)) !== null) {
      // Push text before this match
      if (match.index > lastIndex) {
        lineElements.push(line.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // Bold
        lineElements.push(
          <strong key={`b-${lineIdx}-${match.index}`}>{match[2]}</strong>
        );
      } else if (match[3]) {
        // Link
        lineElements.push(
          <a
            key={`a-${lineIdx}-${match.index}`}
            href={match[5]}
            className="chatbot-link"
          >
            {match[4]}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    // Push remaining text
    if (lastIndex < line.length) {
      lineElements.push(line.substring(lastIndex));
    }

    if (lineElements.length === 0) {
      lineElements.push('');
    }

    parts.push(...lineElements);
    if (lineIdx < lines.length - 1) {
      parts.push(<br key={`br-${lineIdx}`} />);
    }
  });

  return parts;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add welcome message when first opened
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          id: 'welcome',
          role: 'bot',
          text:
            '✨ Welcome to **ZAMORA** — where timeless elegance meets you.\n\n' +
            'I\'m your personal style concierge. Allow me to assist you with:\n\n' +
            '• 🖤 Curated product recommendations & new arrivals\n' +
            '• 💫 Personal styling advice for any occasion\n' +
            '• 📦 Shipping, delivery & boutique services\n' +
            '• 📏 Finding your perfect size & fit\n' +
            '• 🤍 Returns, exchanges & garment care\n\n' +
            'How may I style you today?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: data.reply || data.error || 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'bot',
          text: '⚠️ Unable to connect. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (msg: string) => {
    sendMessage(msg);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'chatbot-toggle--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-comment-dots"></i>
            {messages.length === 0 && (
              <span className="chatbot-toggle-badge">1</span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'chatbot-window--open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <span>Z</span>
            </div>
            <div>
              <h4 className="chatbot-header-title">ZAMORA Concierge</h4>
              <span className="chatbot-header-status">
                <span className="chatbot-status-dot"></span>
                Personal Style Concierge • Online
              </span>
            </div>
          </div>
          <button
            className="chatbot-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chatbot-msg ${msg.role === 'user' ? 'chatbot-msg--user' : 'chatbot-msg--bot'}`}
            >
              {msg.role === 'bot' && (
                <div className="chatbot-msg-avatar">Z</div>
              )}
              <div className="chatbot-msg-bubble">
                <div className="chatbot-msg-text">
                  {renderMessageText(msg.text)}
                </div>
                <span className="chatbot-msg-time">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chatbot-msg chatbot-msg--bot">
              <div className="chatbot-msg-avatar">Z</div>
              <div className="chatbot-msg-bubble">
                <div className="chatbot-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="chatbot-quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="chatbot-quick-btn"
                onClick={() => handleQuickAction(action.message)}
                disabled={isLoading}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form className="chatbot-input-area" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            maxLength={1000}
          />
          <button
            type="submit"
            className="chatbot-send"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </>
  );
}
