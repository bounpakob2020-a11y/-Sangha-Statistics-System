
import React, { useState, useMemo } from 'react';
import { AdminTab } from './components/AdminTab';
import { SearchTab } from './components/SearchTab';
import { SanghaMember, SanghaTitle, FamilyRelation } from './types';
import { Database, Search, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'search'>('admin');
  const [members, setMembers] = useState<SanghaMember[]>([]);
  const [editingMember, setEditingMember] = useState<SanghaMember | null>(null);

  const handleSaveMember = (member: SanghaMember) => {
    if (members.find(m => m.id === member.id)) {
      setMembers(prev => prev.map(m => m.id === member.id ? member : m));
    } else {
      setMembers(prev => [...prev, member]);
    }
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleEditRequest = (member: SanghaMember) => {
    setEditingMember(member);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <LayoutDashboard size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-700">
                  ລະບົບສະຖິຕິພຣະສົງ-ສາມະເນນ
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Sangha Statistics System 2025</p>
              </div>
            </div>
            
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'admin'
                    ? 'bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Database size={18} />
                ສໍາລັບແອັດມິນ
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'search'
                    ? 'bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Search size={18} />
                ສໍາລັບຄົ້ນຫາ
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'admin' ? (
          <AdminTab 
            onSave={handleSaveMember} 
            members={members}
            onEdit={handleEditRequest}
            onDelete={handleDeleteMember}
            editingMember={editingMember}
          />
        ) : (
          <SearchTab 
            members={members} 
            onEdit={handleEditRequest}
            onDelete={handleDeleteMember}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            Copyright © 2025 ລະບົບສະຖິຕິ | By ເອໄອ ໃຈທໍ໊
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
