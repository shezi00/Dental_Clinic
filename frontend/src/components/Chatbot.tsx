'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! Welcome to Harbord Dentistry. How can I help you today? Please choose an option below or type your question.'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const aiBackendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://127.0.0.1:8000';
  // =========================================================================
  // STATE KEYS TO KEEP BOOKING FLOW IN PURE PYTHON (BYPASSES GEMINI)
  // =========================================================================
  const [bookingStep, setBookingStep] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<Record<string, any>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);
    setShowOptions(false);

    try {
      // PROPERLY PASS booking_step AND booking_data BACK TO FASTAPI
      const response = await fetch(`${aiBackendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          booking_step: bookingStep,
          booking_data: bookingData
        })
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
        
        // PERSIST THE BACKEND STATE FOR THE NEXT TURN
        setBookingStep(data.next_step ?? null);
        setBookingData(data.booking_data ?? {});
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'I encountered an error. Please try again.' }
        ]);
      }
    } catch (error) {
      console.error('Connection Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Unable to connect to the backend server. Please verify port 8000 is active.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const handleOptionClick = (optionText: string) => {
    sendMessage(optionText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#FAF7F2] bg-[#0F2E2A] text-2xl text-[#FAF7F2] shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 flex h-[560px] max-h-[calc(100vh-100px)] w-[380px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-[#0F2E2A]/15 bg-[#FAF7F2] shadow-2xl">
          
          {/* Header */}
          <div className="bg-[#0F2E2A] p-4 text-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="m-0 text-base font-semibold">Harbord Dentistry Assistant</h3>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto bg-[#FAF7F2] p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'rounded-br-none bg-[#0F2E2A] text-[#FAF7F2]'
                      : 'rounded-bl-none bg-[#EAE5D9] text-[#0F2E2A] shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Initial Choice Chips */}
            {showOptions && (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleOptionClick('I have a question about policies or services')}
                  className="rounded-xl border border-[#0F2E2A]/20 bg-white px-4 py-2.5 text-left text-sm font-medium text-[#0F2E2A] shadow-sm transition hover:bg-[#EAE5D9]"
                >
                  ❓ Ask a Question
                </button>
                <button
                  onClick={() => handleOptionClick('I want to book an appointment')}
                  className="rounded-xl border border-[#0F2E2A]/20 bg-[#0F2E2A] px-4 py-2.5 text-left text-sm font-medium text-[#FAF7F2] shadow-sm transition hover:bg-[#17423c]"
                >
                  📅 Book an Appointment
                </button>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-[#EAE5D9] px-4 py-3 text-[#0F2E2A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F2E2A] opacity-50 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F2E2A] opacity-50 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F2E2A] opacity-50 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-[#0F2E2A]/10 bg-[#FAF7F2] p-3"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-xl border border-[#D5CFC2] bg-white px-3.5 py-2.5 text-sm text-[#0F2E2A] outline-none transition focus:border-[#0F2E2A] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-[#0F2E2A] px-4 py-2.5 text-sm font-medium text-[#FAF7F2] transition hover:bg-[#17423c] disabled:opacity-50 active:scale-95"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}