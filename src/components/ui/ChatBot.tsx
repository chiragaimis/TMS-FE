import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Trash2, Wifi, WifiOff, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../utils/helpers';

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, connected, isStreaming, error, sendMessage, clearMessages } = useChat();

  // auto-scroll to bottom on new message/token
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
        title="TMS AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Bot className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary-600 text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm leading-none">TMS Assistant</p>
                  <p className="text-xs text-primary-200 mt-0.5">Powered by Chirag Chandratre</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Connection status */}
                <span title={connected ? 'Connected' : 'Disconnected'}>
                  {connected
                    ? <Wifi className="w-4 h-4 text-green-300" />
                    : <WifiOff className="w-4 h-4 text-red-300" />
                  }
                </span>
                <button
                  onClick={clearMessages}
                  title="Clear chat"
                  className="p-1 rounded hover:bg-primary-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-primary-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
                  <Bot className="w-10 h-10 text-primary-200" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hi! I'm your TMS Assistant</p>
                    <p className="text-xs mt-1">Ask me about students, fees, attendance, or anything TMS-related.</p>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full mt-2">
                    {[
                      'How many students have overdue fees?',
                      "What's today's attendance?",
                      'List active batches',
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => { sendMessage(q); }}
                        className="text-xs text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-400 hover:text-primary-600 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words',
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                    )}
                  >
                    {msg.content}
                    {msg.streaming && (
                      <span className="inline-block w-1.5 h-4 bg-primary-400 ml-0.5 animate-pulse rounded-sm align-middle" />
                    )}
                  </div>
                </div>
              ))}

              {/* Error banner */}
              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={connected ? 'Ask anything about TMS...' : 'Connecting...'}
                  disabled={!connected || isStreaming}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || !connected || isStreaming}
                  className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isStreaming
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-1.5">Developed by Chirag Chandratre</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
