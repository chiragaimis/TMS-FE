import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws/chat/ai/';

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const idRef = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onclose = () => {
      setConnected(false);
      // auto-reconnect after 3s
      setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      setError('Unable to connect to AI. Make sure Ollama is running.');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'connected') {
        // welcome message — ignore, already shown via connected state
      } else if (data.type === 'stream_start') {
        setIsStreaming(true);
        const newId = ++idRef.current;
        setMessages((prev) => [
          ...prev,
          { id: newId, role: 'assistant', content: '', streaming: true },
        ]);
      } else if (data.type === 'token') {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant' && last.streaming) {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + data.content,
            };
          }
          return updated;
        });
      } else if (data.type === 'stream_end') {
        setIsStreaming(false);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.streaming) {
            updated[updated.length - 1] = { ...last, streaming: false };
          }
          return updated;
        });
      } else if (data.type === 'error') {
        setIsStreaming(false);
        setError(data.message);
      }
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const userMsg: ChatMessage = { id: ++idRef.current, role: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);
      setError(null);

      wsRef.current.send(
        JSON.stringify({ message: text })
      );
    },
    []
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, connected, isStreaming, error, sendMessage, clearMessages };
}
