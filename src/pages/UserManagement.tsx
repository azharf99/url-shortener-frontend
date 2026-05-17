import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  X,
  Shield,
  User as UserIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  // Pagination & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: {
          search: searchTerm,
          page: currentPage,
          limit: limit
        }
      });
      setUsers(response.data.users || []);
      setTotalCount(response.data.meta.total);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleRecaptcha = async (action: string) => {
    if (!executeRecaptcha) return null;
    const token = await executeRecaptcha(action);
    (window as any).captchaToken = token;
    return token;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await handleRecaptcha('edit_user');
        await api.put(`/admin/users/${editingUser.id}`, {
          username: formData.username,
          email: formData.email,
          role: formData.role
        });
      } else {
        await handleRecaptcha('create_user');
        await api.post('/admin/users', formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await handleRecaptcha('delete_user');
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1200px] mx-auto w-full space-y-8 text-[#e1e2ec]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">User Base</h1>
          <p className="text-[#8c909f] mt-1 text-sm sm:text-base font-medium">Administrative Control Center</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-[#3b82f6]/20"
        >
          <UserPlus size={20} />
          Add New User
        </button>
      </div>

      <div className="bg-[#1d2027] border border-[#32353c] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 sm:p-8 border-b border-[#32353c] bg-[#272a31]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-black text-white">System Users ({totalCount})</h3>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-[#10131a] border border-[#32353c] rounded-xl py-2.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#272a31]/50 text-[#8c909f] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Identity</th>
                <th className="px-8 py-5">Email Address</th>
                <th className="px-8 py-5 text-center">Status/Role</th>
                <th className="px-8 py-5">Onboarded</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#32353c]">
              {isLoading ? (
                <tr><td colSpan={5} className="p-20 text-center text-[#8c909f] font-bold">Accessing Database...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-[#8c909f]">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#272a31]/20 transition-all group text-sm">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                          <UserIcon size={20} />
                        </div>
                        <span className="font-bold text-white">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[#c2c6d6] font-medium">{user.email}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                        user.role === 'admin' 
                          ? "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20" 
                          : "bg-[#424754]/10 text-[#8c909f] border-[#424754]/20"
                      )}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[#8c909f] whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-4">
                        <button onClick={() => handleOpenEditModal(user)} className="text-[#8c909f] hover:text-[#3b82f6] transition-colors" title="Edit User">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-[#8c909f] hover:text-red-400 transition-colors" title="Delete User">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="flex md:hidden flex-col divide-y divide-[#32353c]">
          {isLoading ? (
            <div className="p-10 text-center text-[#8c909f] font-bold">Accessing Database...</div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-[#8c909f]">No users found.</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="p-5 flex flex-col gap-4 hover:bg-[#272a31]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] shrink-0">
                    <UserIcon size={24} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-white text-base truncate">{user.username}</span>
                    <span className="text-[#c2c6d6] text-sm truncate">{user.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                    user.role === 'admin' 
                      ? "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20" 
                      : "bg-[#424754]/10 text-[#8c909f] border-[#424754]/20"
                  )}>
                    {user.role === 'admin' && <Shield size={12} />}
                    {user.role}
                  </span>
                  
                  <span className="text-[#8c909f] text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-[#32353c]/50">
                  <button onClick={() => handleOpenEditModal(user)} className="text-[#8c909f] hover:text-[#3b82f6] transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-[#8c909f] hover:text-red-400 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-[#32353c] bg-[#272a31]/10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <p className="text-xs text-[#8c909f] font-black uppercase tracking-widest">
              Record {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-xl bg-[#10131a] border border-[#32353c] text-[#8c909f] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-xl bg-[#10131a] border border-[#32353c] text-[#8c909f] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1d2027] border border-[#32353c] w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col text-white max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b border-[#32353c] flex justify-between items-center bg-[#272a31]/20 shrink-0">
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
                {editingUser ? 'Modify User' : 'Register User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8c909f] hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8c909f] uppercase tracking-widest ml-1">Username</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#10131a] border border-[#32353c] rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8c909f] uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-[#10131a] border border-[#32353c] rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8c909f] uppercase tracking-widest ml-1">Security Key</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full bg-[#10131a] border border-[#32353c] rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8c909f] uppercase tracking-widest ml-1">Privilege Level</label>
                <select
                  className="w-full bg-[#10131a] border border-[#32353c] rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[#3b82f6] transition-colors appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                >
                  <option value="user">Standard Account</option>
                  <option value="admin">Root Administrator</option>
                </select>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#3b82f6]/20 active:scale-[0.97]"
                >
                  {editingUser ? 'Update Records' : 'Authorize User'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
