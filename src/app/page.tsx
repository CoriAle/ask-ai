'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isButtonDisabled, setIsButttonDisabled] = useState(false);

  const askTheAI = async () => {
    if (!input.trim()) return;
    
    setIsButttonDisabled(true);
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };
  
    setMessageHistory(prev => [...prev, userMessage]);
    setInput(''); // Clear the textarea immediately
  
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content }),
      });
  
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
  
      const data = await res.json();
  
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'No response from AI.',
      };
  
      setMessageHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking the AI:', error);
      setMessageHistory(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    }
    setIsButttonDisabled(false)
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-6">
        {/* Conversation History */}
        <div className="bg-white p-6 rounded-lg shadow-md h-64 overflow-y-auto">
          <div className="space-y-4 text-sm">
            {messageHistory.map((msg, idx) => (
              <div key={idx} className="text-left">
                <span
                  className={`font-bold ${
                    msg.role === 'user' ? 'text-blue-800' : 'text-green-800'
                  }`}
                >
                  {msg.role === 'user' ? 'User:' : 'Assistant:'}
                </span>
                <span className="text-black"> {msg.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Textarea Input */}
        <textarea
          rows={6}
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={askTheAI}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          disabled={isButtonDisabled}
        >
          { !isButtonDisabled ? 'Ask the AI' : 'Processing...'}
        </button>
      </div>
    </main>
  );
}