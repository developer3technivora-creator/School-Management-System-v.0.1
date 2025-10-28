import React, { useState } from 'react';
import type { Student } from '../../types';
import { ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon } from '../Icons';

interface TeacherContact {
    id: string;
    name: string;
    subject: string;
}

interface Conversation {
    id: string;
    sender: 'student' | 'teacher';
    text: string;
    timestamp: string;
}

const mockTeachers: TeacherContact[] = [
    { id: 't1', name: 'Ms. Davis', subject: 'English' },
    { id: 't2', name: 'Mr. Smith', subject: 'Mathematics' },
    { id: 't3', name: 'Mrs. Jones', subject: 'History' },
    { id: 't4', name: 'Dr. Chen', subject: 'Science' },
];

const mockConversations: Record<string, Conversation[]> = {
    't1': [
        { id: 'c1', sender: 'teacher', text: "Hi Alice, just a reminder your essay is due on Friday. Let me know if you have any questions!", timestamp: '2024-10-28T14:30:00Z' },
        { id: 'c2', sender: 'student', text: "Thanks, Ms. Davis! I'm almost finished with it.", timestamp: '2024-10-28T15:05:00Z' },
    ],
    't2': [
        { id: 'c3', sender: 'student', text: "Mr. Smith, I'm having trouble with question 5 on the worksheet.", timestamp: '2024-10-27T18:00:00Z' },
    ],
    't3': [],
    't4': [],
};

export const StudentCommunicationPage: React.FC<{ student: Student }> = ({ student }) => {
    const [conversations, setConversations] = useState(mockConversations);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>(mockTeachers[0].id);
    const [newMessage, setNewMessage] = useState('');
    
    const selectedTeacher = mockTeachers.find(t => t.id === selectedTeacherId);
    const selectedConversation = conversations[selectedTeacherId] || [];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newConversations = { ...conversations };
        newConversations[selectedTeacherId].push({
            id: `c${Date.now()}`,
            sender: 'student' as const,
            text: newMessage,
            timestamp: new Date().toISOString()
        });
        
        setConversations(newConversations);
        setNewMessage('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Messages</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Communicate with your teachers.</p>
                </div>
            </div>
            
             <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 h-[calc(100vh-280px)] flex">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                    <h2 className="p-4 text-lg font-bold border-b border-slate-200 dark:border-slate-700">Contacts</h2>
                    <ul className="overflow-y-auto flex-grow">
                        {mockTeachers.map(teacher => (
                            <li key={teacher.id}>
                                <button onClick={() => setSelectedTeacherId(teacher.id)} className={`w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 ${selectedTeacherId === teacher.id ? 'bg-blue-50 dark:bg-slate-700' : ''}`}>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{teacher.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.subject}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Chat Window */}
                <div className="w-2/3 flex flex-col">
                    {selectedTeacher ? (
                        <>
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-lg">{selectedTeacher.name}</h3>
                                <p className="text-sm text-slate-500">{selectedTeacher.subject}</p>
                            </div>
                            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                                {selectedConversation.map(chat => (
                                    <div key={chat.id} className={`flex items-end gap-2 ${chat.sender === 'student' ? 'justify-end' : ''}`}>
                                        {chat.sender === 'teacher' && <UserCircleIcon className="w-8 h-8 text-slate-400" />}
                                        <div className={`max-w-lg p-3 rounded-2xl ${chat.sender === 'student' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
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
                                        placeholder={`Message ${selectedTeacher.name}...`}
                                        className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-3 pr-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Send</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                            <p>Select a contact to view messages.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
