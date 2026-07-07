// Messages Page

import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { messages, teachers } from '../data/mockData';
import { Message } from '../types';

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('teacher-1');
  const [newMessage, setNewMessage] = useState('');

  const conversationTeachers = [
    {
      id: 'teacher-1',
      name: 'الشيخة سارة الأحمد',
      avatar: 'https://i.pravatar.cc/150?u=teacher1',
      lastMessage: 'بالتأكيد! سأساعدك في الحصة القادمة',
      time: '15:00',
      unread: 1,
    },
    {
      id: 'teacher-2',
      name: 'الشيخ محمد الفهيد',
      avatar: 'https://i.pravatar.cc/150?u=teacher2',
      lastMessage: 'حسناً، سنراجع سورة الملك غداً',
      time: 'أمس',
      unread: 0,
    },
  ];

  const getMessagesForConversation = (conversationId: string) => {
    return messages.filter(m =>
      (m.senderId === conversationId || m.receiverId === conversationId)
    );
  };

  const conversationMessages = selectedConversation
    ? getMessagesForConversation(selectedConversation)
    : [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Would send message via API
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-surface rounded-2xl shadow-card overflow-hidden flex">
      {/* Conversations List */}
      <div className="w-full md:w-80 border-l border-gray-100 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في الرسائل..."
              className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversationTeachers.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                selectedConversation === conversation.id ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.unread > 0 && (
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold truncate">{conversation.name}</p>
                    <span className="text-xs text-gray-400">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={conversationTeachers.find(t => t.id === selectedConversation)?.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold">
                    {conversationTeachers.find(t => t.id === selectedConversation)?.name}
                  </p>
                  <p className="text-xs text-gray-500">متصل الآن</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => {
                const isOwn = message.senderId === 'student-1';
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? 'text-left' : 'text-right'}`}>
                      <div className={`inline-block p-3 rounded-2xl ${
                        isOwn
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}>
                        <p>{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${
                        isOwn ? '' : 'justify-end'
                      }`}>
                        <span>{new Date(message.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                        {isOwn && (
                          message.read ? <CheckCheck size={14} className="text-primary" /> : <Check size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="اكتب رسالتك..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Search size={64} className="mx-auto mb-4 opacity-50" />
              <p>اختر محادثة للبدء</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Chat View Placeholder */}
      <div className="md:hidden flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center p-4">
          <p>اختر محادثة من القائمة</p>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;