import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Maximize2, Minimize2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  options?: string[]; // 選択肢を追加
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'こんにちは！naocanのチャットボットです。何についてお聞きになりたいですか？',
      timestamp: new Date(),
      options: [
        '花束の注文方法',
        '商品の種類について',
        '予約システムについて',
        '花言葉について',
        'その他の質問'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await geminiService.sendMessage(textToSend, conversationHistory);
      
      // 応答に基づいて選択肢を生成
      const options = generateOptions(textToSend, response);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        options: options
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '申し訳ございません。一時的なエラーが発生しました。しばらく時間をおいてから再度お試しください。',
        timestamp: new Date(),
        options: ['もう一度試す', '別の質問をする']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 選択肢を生成する関数
  const generateOptions = (userQuestion: string, response: string): string[] => {
    const question = userQuestion.toLowerCase();
    
    if (question.includes('注文') || question.includes('購入')) {
      return ['支払い方法について', '配送について', 'キャンセルについて', 'その他の質問'];
    } else if (question.includes('商品') || question.includes('種類')) {
      return ['仏花について', 'プリザーブドフラワーについて', 'ウェディングブーケについて', 'その他の商品'];
    } else if (question.includes('予約')) {
      return ['予約の変更について', '予約のキャンセルについて', '予約確認について', 'その他の質問'];
    } else if (question.includes('花言葉')) {
      return ['バラの花言葉', 'ユリの花言葉', '菊の花言葉', 'その他の花'];
    } else {
      return ['商品について', '注文について', '予約について', 'その他の質問'];
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* チャットボットボタン */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-transparent hover:scale-110 transition-all duration-200 shadow-lg rounded-full"
            aria-label="チャットボットを開く"
          >
            <img
              src="/chatbot.png"
              alt="naocan チャットボット"
              className="w-40 h-40 object-contain"
            />
          </button>
          
          {/* 吹き出しメッセージ */}
          <div className="absolute bottom-full right-0 mb-3 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-3 animate-bounce">
            <div className="text-sm text-gray-800 font-medium text-center">
              なんでも質問してね♪
            </div>
            {/* 吹き出しの矢印 */}
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* チャットウィンドウ */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${
          isExpanded 
            ? 'w-120 h-[900px]' 
            : 'w-96 h-[600px]'
        }`}>
          {/* ヘッダー */}
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/chatbot.png"
                alt="naocan チャットボット"
                className="w-8 h-8 object-contain"
              />
              <span className="font-semibold">naocan チャット</span>
            </div>
            <div className="flex items-center gap-2">
              {/* 拡大/縮小ボタン */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-green-600 rounded-full p-1 transition-colors"
                aria-label={isExpanded ? "チャットを縮小" : "チャットを拡大"}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              {/* 閉じるボタン */}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-green-600 rounded-full p-1 transition-colors"
                aria-label="チャットを閉じる"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
                
                {/* 選択肢ボタン */}
                {message.role === 'assistant' && message.options && message.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleSendMessage(option)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    <span className="text-sm">入力中...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg px-3 py-2 transition-colors"
                aria-label="メッセージを送信"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;

