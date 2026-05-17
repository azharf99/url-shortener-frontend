import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Link as LinkIcon,
  MousePointerClick,
  Calendar,
  Zap,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface URL {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  clicks: number;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Pagination & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);

  const fetchUrls = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/urls', {
        params: {
          search: searchTerm,
          page: currentPage,
          limit: limit
        }
      });
      setUrls(response.data.urls || []);
      setTotalCount(response.data.meta.total);
    } catch (err) {
      console.error('Failed to fetch URLs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleRecaptcha = async (action: string) => {
    if (!executeRecaptcha) return null;
    const token = await executeRecaptcha(action);
    (window as any).captchaToken = token;
    return token;
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await handleRecaptcha('shorten_url');
      await api.post('/shorten', { original_url: originalUrl });
      setOriginalUrl('');
      setCurrentPage(1);
      fetchUrls();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      await handleRecaptcha('delete_url');
      await api.delete(`/urls/${id}`);
      fetchUrls();
    } catch (err) {
      alert('Failed to delete URL');
    }
  };

  const copyToClipboard = (shortUrl: string, id: number) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-full w-full flex flex-col p-4 sm:p-6 lg:p-10 max-w-[1200px] mx-auto space-y-8 sm:space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Zap className="text-[#3b82f6] fill-[#3b82f6]/20" size={32} />
            Dashboard
          </h1>
          <p className="text-[#8c909f] mt-1 text-sm sm:text-base font-medium">Professional URL Management</p>
        </div>
      </div>

      {/* Shorten Link Form */}
      <div className="bg-[#1d2027] border border-[#32353c] p-6 sm:p-8 rounded-[2.5rem] shadow-2xl relative overflow-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <h2 className="md:text-xl text-sm font-bold text-white mb-6 flex items-center gap-3 relative">
          <Plus className="text-[#3b82f6]" size={20} />
          Create New Link
        </h2>
        <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4 relative">
          <div className="flex-1">
            <input
              type="url"
              placeholder="https://example.com/very-long-url"
              className="w-full bg-[#10131a] border border-[#32353c] rounded-2xl py-4 px-6 text-white text-base focus:outline-none focus:border-[#3b82f6] transition-all"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="md:w-auto w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
          >
            Shorten
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-xs font-bold">{error}</p>}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1d2027] p-8 rounded-[2.5rem] border border-[#32353c] flex items-center gap-6">
          <div className="bg-[#3b82f6]/10 w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-[#3b82f6]">
            <LinkIcon size={32} />
          </div>
          <div>
            <p className="text-[#8c909f] text-xs font-black uppercase tracking-widest mb-1">Active Links</p>
            <p className="text-4xl font-black text-white">{totalCount}</p>
          </div>
        </div>

        <div className="bg-[#1d2027] p-8 rounded-[2.5rem] border border-[#32353c] flex items-center gap-6">
          <div className="bg-purple-500/10 w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-purple-400">
            <MousePointerClick size={32} />
          </div>
          <div>
            <p className="text-[#8c909f] text-xs font-black uppercase tracking-widest mb-1">Impact (Total Clicks)</p>
            <p className="text-4xl font-black text-white">
              {urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0).toLocaleString()}+
            </p>
          </div>
        </div>
      </div>

      {/* Links List - Traditional Table with Search & Pagination */}
      <div className="bg-[#1d2027] border border-[#32353c] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 sm:p-8 border-b border-[#32353c] bg-[#272a31]/20 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-black text-white">Link Management</h3>

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]" size={18} />
              <input
                type="text"
                placeholder="Search links..."
                className="w-full bg-[#10131a] border border-[#32353c] rounded-xl py-2.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left table-fixed min-w-[600px]">
            <thead className="bg-[#272a31]/50 text-[#8c909f] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-5 w-1/2 lg:w-3/5">Link Information</th>
                <th className="px-8 py-5 text-center w-20 lg:w-32">Clicks</th>
                <th className="px-8 py-5 w-32 lg:w-40">Created</th>
                <th className="px-8 py-5 text-right w-28 lg:w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#32353c]">
              {isLoading ? (
                <tr><td colSpan={4} className="p-20 text-center text-[#8c909f] font-bold">Synchronizing...</td></tr>
              ) : urls.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-[#8c909f]">No links found.</td></tr>
              ) : (
                urls.map((url) => (
                  <tr key={url.id} className="hover:bg-[#272a31]/20 transition-all group text-sm">
                    <td className="px-8 py-6 min-w-0 overflow-hidden">
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[#c2c6d6] font-bold truncate leading-tight" title={url.original_url}>
                          {url.original_url}
                        </p>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-[#3b82f6] font-mono font-black text-xs truncate">
                            {url.short_url}
                          </span>
                          <button
                            onClick={() => copyToClipboard(url.short_url, url.id)}
                            className="text-[#8c909f] hover:text-[#3b82f6] transition-colors shrink-0"
                            title="Copy Short URL"
                          >
                            {copiedId === url.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-[#10131a] px-3 py-1 rounded-lg font-black text-white border border-[#32353c] text-xs shrink-0">
                        {url.clicks || 0}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[#8c909f] whitespace-nowrap text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(url.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 lg:gap-4">
                        <a
                          href={url.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8c909f] hover:text-white transition-colors"
                          title="Open Destination"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(url.id)}
                          className="text-[#8c909f] hover:text-red-400 transition-colors"
                          title="Remove Link"
                        >
                          <Trash2 size={18} />
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
            <div className="p-10 text-center text-[#8c909f] font-bold">Synchronizing...</div>
          ) : urls.length === 0 ? (
            <div className="p-10 text-center text-[#8c909f]">No links found.</div>
          ) : (
            urls.map((url) => (
              <div key={url.id} className="p-5 flex flex-col gap-4 hover:bg-[#272a31]/20 transition-all">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#c2c6d6] font-bold truncate leading-tight text-sm" title={url.original_url}>
                    {url.original_url}
                  </p>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-[#3b82f6] font-mono font-black text-xs truncate">
                      {url.short_url}
                    </span>
                    <button
                      onClick={() => copyToClipboard(url.short_url, url.id)}
                      className="text-[#8c909f] hover:text-[#3b82f6] transition-colors shrink-0"
                      title="Copy Short URL"
                    >
                      {copiedId === url.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[#8c909f] text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(url.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#10131a] px-2 py-0.5 rounded-md font-black text-white border border-[#32353c] shrink-0">
                      {url.clicks || 0}
                    </span>
                    <span>Clicks</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-3 border-t border-[#32353c]/50">
                  <a
                    href={url.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8c909f] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                    title="Open Destination"
                  >
                    <ExternalLink size={16} /> Open
                  </a>
                  <button
                    onClick={() => handleDelete(url.id)}
                    className="text-[#8c909f] hover:text-red-400 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                    title="Remove Link"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-[#32353c] bg-[#272a31]/10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <p className="text-xs text-[#8c909f] font-black uppercase tracking-widest">
              Showing Page {currentPage} of {totalPages}
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
    </div>
  );
};

export default Dashboard;
