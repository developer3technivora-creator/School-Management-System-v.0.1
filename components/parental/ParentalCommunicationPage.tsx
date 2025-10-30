import React, { useState } from 'react';
import type { ParentMessage } from '../../types';
import { ArrowUturnLeftIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from '../Icons';
import { mockParentMessages } from '../../data/mockData';

export const ParentalCommunicationPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [messages, setMessages] = useState<ParentMessage[]>(mockParentMessages);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockParentMessages[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');

    const selectedConversation = messages.find(m => m.id === selectedConversationId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId) return;

        const updatedMessages = messages.map(msg => {
            if (msg.id === selectedConversationId) {
                return {
                    ...msg,
                    conversation: [
                        ...msg.conversation,
                        // FIX: Explicitly cast 'school' as a const to satisfy the '"parent" | "school"' literal type for the 'sender' property.
                        { id: `c${Date.now()}`, sender: 'school' as const, text: newMessage, timestamp: new Date().toISOString() }
                    ]
                };
            }
            return msg;
        });

        setMessages(updatedMessages);
        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <ChatBubbleLeftRightIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Parental Communication</h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">Manage conversations with parents and guardians.</p>
                        </div>
                    </div>
                    <button onClick={onBackToDashboard} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700">
                        <ArrowUturnLeftIcon className="h-5 w-5" /><span>Dashboard</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 h-[calc(100vh-220px)] flex">
                    {/* Sidebar */}
                    <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                        <h2 className="p-4 text-lg font-bold border-b border-slate-200 dark:border-slate-700">Conversations</h2>
                        <ul className="overflow-y-auto flex-grow">
                            {messages.map(msg => (
                                <li key={msg.id}>
                                    <button onClick={() => setSelectedConversationId(msg.id)} className={`w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 ${selectedConversationId === msg.id ? 'bg-blue-50 dark:bg-slate-700' : ''}`}>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{msg.parentName}</p>
                                        {/* FIX: Replaced .at(-1) with bracket notation for broader JS/TS compatibility. */}
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{msg.conversation[msg.conversation.length - 1]?.text}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Chat Window */}
                    <div className="w-2/3 flex flex-col">
                        {selectedConversation ? (
                            <>
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-lg">{selectedConversation.parentName}</h3>
                                </div>
                                <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                                    {selectedConversation.conversation.map(chat => (
                                        <div key={chat.id} className={`flex items-end gap-2 ${chat.sender === 'school' ? 'justify-end' : ''}`}>
                                            {chat.sender === 'parent' && <UserCircleIcon className="w-8 h-8 text-slate-400" />}
                                            <div className={`max-w-lg p-3 rounded-2xl ${chat.sender === 'school' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                                                <p>{chat.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-3 pr-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Send</button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                                <p>Select a conversation to start chatting.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};