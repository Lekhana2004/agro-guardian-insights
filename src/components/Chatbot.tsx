import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  lang: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ lang }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const nextMessages = [...messages, { role: 'user' as const, content: input.trim() }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          lang,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistant = '';
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          assistant += decoder.decode(value);
          setMessages((prev) => {
            const clone = [...prev];
            const last = clone[clone.length - 1];
            if (!last || last.role !== 'assistant') {
              clone.push({ role: 'assistant', content: assistant });
            } else {
              clone[clone.length - 1] = { role: 'assistant', content: assistant };
            }
            return clone;
          });
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: failed to get response.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle>{t('chat.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4" ref={containerRef}>
        {messages.length === 0 ? (
          <p className="text-gray-500">{t('chat.empty')}</p>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}>
                {m.content}
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={sendMessage} className="w-full flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {t('chat.send')}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
