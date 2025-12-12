import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Plus, Settings, Search, Bell, Menu, Sparkles, CheckCircle2, Circle, X, ListOrdered, CalendarClock, ArrowRight } from 'lucide-react';
import { breakdownTask, prioritizeTasks, generateSchedule, ScheduleItem } from '../services/geminiService';
import { Task } from '../types';

export const AppView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Review quarterly goals', completed: false },
    { id: '2', text: 'Email marketing team', completed: true },
    { id: '3', text: 'Prepare presentation deck', completed: false },
    { id: '4', text: 'Buy groceries for dinner', completed: false },
    { id: '5', text: 'Call James about the contract', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'schedule'>('list');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const handleAiExpand = async () => {
    if (!inputValue.trim()) return;
    setIsAiLoading(true);
    const brokenDown = await breakdownTask(inputValue);
    
    const newTasks = brokenDown.map((text, idx) => ({
      id: `${Date.now()}-${idx}`,
      text: text,
      completed: false
    }));

    setTasks([...newTasks, ...tasks]);
    setInputValue('');
    setIsAiLoading(false);
  };

  const handleSmartPrioritize = async () => {
    if (tasks.length < 2) return;
    setIsPrioritizing(true);
    const sortedIds = await prioritizeTasks(tasks.map(t => ({id: t.id, text: t.text})));
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    const newOrder: Task[] = [];
    sortedIds.forEach(id => {
      const t = taskMap.get(id);
      if (t) { newOrder.push(t); taskMap.delete(id); }
    });
    taskMap.forEach(t => newOrder.push(t));
    setTasks(newOrder);
    setIsPrioritizing(false);
  };

  const handleGenerateSchedule = async () => {
    setIsScheduling(true);
    // Only schedule incomplete tasks
    const activeTasks = tasks.filter(t => !t.completed).map(t => ({id: t.id, text: t.text}));
    const newSchedule = await generateSchedule(activeTasks);
    setSchedule(newSchedule);
    setViewMode('schedule');
    setIsScheduling(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-gray-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className="bg-[#0c0c0e] border-r border-white/5 flex-shrink-0 flex flex-col overflow-hidden relative z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <span className="font-bold text-white">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight">FlowState</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {['Inbox', 'Today', 'Upcoming', 'Filters', 'Labels'].map((item, i) => (
            <button key={item} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${i === 0 ? 'bg-indigo-600/10 text-indigo-200' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <span className="flex items-center justify-between">
                {item}
                {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-black group-hover:ring-indigo-500/50 transition-all"></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Demo User</div>
              <div className="text-xs text-gray-500 truncate">Pro Plan</div>
            </div>
            <Settings size={16} className="text-gray-500 group-hover:rotate-90 transition-transform duration-500" />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-black via-[#0a0a0c] to-[#0f0f12]">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
               <h1 className="text-lg font-medium">Inbox</h1>
               {viewMode === 'schedule' && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Focus Plan</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block group">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 focus:w-72 w-64 transition-all duration-300"
               />
             </div>
             <button className="text-gray-400 hover:text-white transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 ring-2 ring-black"></span>
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Context Aware Controls */}
            <div className="flex items-center gap-4 mb-6">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
               >
                 Tasks
               </button>
               <button 
                 onClick={handleGenerateSchedule}
                 disabled={isScheduling}
                 className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all overflow-hidden ${viewMode === 'schedule' ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' : 'text-gray-500 hover:text-indigo-300'}`}
               >
                  <span className="relative z-10 flex items-center gap-2">
                     {isScheduling ? <Sparkles size={14} className="animate-spin" /> : <CalendarClock size={14} />}
                     {isScheduling ? 'Planning...' : 'Flow Plan'}
                  </span>
                  {viewMode === 'schedule' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-indigo-500/10" />}
               </button>
            </div>

            <LayoutGroup>
              <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                  <motion.div 
                    key="list-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Input */}
                    <div className="group relative z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <form onSubmit={handleAddTask} className="relative bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-4 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-transparent">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="What needs to be done?"
                          className="w-full bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none mb-4"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button type="button" className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/5 rounded-md hover:bg-white/10 transition-colors">Today</button>
                            <button type="button" className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/5 rounded-md hover:bg-white/10 transition-colors">Inbox</button>
                          </div>
                          <div className="flex items-center gap-2">
                            {inputValue.length > 3 && (
                              <button 
                                type="button" 
                                onClick={handleAiExpand}
                                disabled={isAiLoading}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md hover:bg-indigo-500/20 transition-all disabled:opacity-50"
                              >
                                <Sparkles size={14} className={isAiLoading ? 'animate-spin' : ''} />
                                {isAiLoading ? 'Thinking...' : 'AI Expand'}
                              </button>
                            )}
                            <button 
                              type="submit"
                              disabled={!inputValue.trim()}
                              className="bg-white text-black p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Task List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-sm font-medium text-gray-500">Tasks ({tasks.filter(t => !t.completed).length})</h3>
                        <button 
                            onClick={handleSmartPrioritize}
                            disabled={isPrioritizing || tasks.length < 2}
                            className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50 hover:bg-indigo-500/10 px-2 py-1 rounded"
                        >
                            <ListOrdered size={14} />
                            {isPrioritizing ? 'Prioritizing...' : 'Smart Sort'}
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <AnimatePresence mode='popLayout'>
                          {tasks.map((task) => (
                            <motion.div
                              layout
                              key={task.id}
                              initial={{ opacity: 0, scale: 0.98, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="group flex items-center gap-3 p-4 bg-[#121214] border border-white/5 rounded-xl hover:border-white/10 transition-colors cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5 relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                              <button 
                                onClick={() => toggleTask(task.id)}
                                className={`flex-shrink-0 transition-all duration-300 ${task.completed ? 'text-green-500 scale-110' : 'text-gray-600 hover:text-indigo-500'}`}
                              >
                                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                              </button>
                              <span className={`flex-1 text-base transition-colors ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'}`}>
                                {task.text}
                              </span>
                              <button 
                                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all scale-90 group-hover:scale-100"
                              >
                                <X size={18} />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="schedule-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 items-start">
                       <Sparkles className="text-indigo-400 mt-1 flex-shrink-0" size={18} />
                       <div>
                          <h3 className="text-indigo-200 font-medium text-sm">AI Generated Flow Plan</h3>
                          <p className="text-indigo-300/60 text-xs mt-1">
                            Optimized for deep work in the morning and administrative tasks in the afternoon.
                          </p>
                       </div>
                    </div>

                    <div className="relative border-l border-white/10 ml-4 space-y-8 py-4">
                       {schedule.map((item, index) => {
                          const task = tasks.find(t => t.id === item.taskId);
                          if (!task) return null;
                          return (
                             <motion.div 
                               key={index}
                               initial={{ opacity: 0, x: 20 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: index * 0.1 }}
                               className="relative pl-8"
                             >
                                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-gray-800 border-2 border-indigo-500"></div>
                                <div className="text-xs font-mono text-gray-500 mb-1">{item.time}</div>
                                <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                                   <div className="font-medium text-gray-200">{task.text}</div>
                                   <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                      <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                                      {item.reasoning}
                                   </div>
                                </div>
                             </motion.div>
                          )
                       })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </LayoutGroup>

          </div>
        </div>
      </main>
    </div>
  );
};