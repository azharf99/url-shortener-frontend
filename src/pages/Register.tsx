import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Link as LinkIcon, User, Mail, Lock, ArrowRight, X, Check } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRecaptcha = async (action: string) => {
    if (!executeRecaptcha) return null;
    const token = await executeRecaptcha(action);
    (window as any).captchaToken = token;
    return token;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await handleRecaptcha('registration');
      await api.post('/register', { username, email, password });
      setSuccess('Registration successful! Your account has been created.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10131a] p-4 sm:p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#10b981]/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[80px] sm:blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#3b82f6]/10 rounded-full translate-y-1/2 translate-x-1/2 blur-[80px] sm:blur-[120px] pointer-events-none"></div>

      <div className="bg-[#1d2027] p-6 sm:p-8 md:p-10 rounded-3xl border border-[#32353c] shadow-2xl w-full max-w-md relative z-10 max-h-[95vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="bg-[#10b981] p-3.5 sm:p-4 rounded-2xl shadow-lg shadow-[#10b981]/30 mb-4 sm:mb-6">
            <LinkIcon size={28} className="text-white sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center text-emerald-400">Join ShortenIt</h2>
          <p className="text-[#8c909f] mt-2 text-sm sm:text-base text-center font-medium">Create your professional account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm mb-6 flex items-start gap-3">
            <div className="bg-red-500/20 p-1 rounded-md shrink-0">
              <X size={14} />
            </div>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm mb-6 flex items-start gap-3">
            <div className="bg-green-500/20 p-1 rounded-md shrink-0">
              <Check size={14} />
            </div>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#8c909f] mb-2 ml-1 tracking-widest uppercase">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]" size={18} />
              <input
                type="text"
                className="w-full bg-[#10131a] border border-[#32353c] rounded-xl py-3 sm:py-3.5 pl-12 pr-4 text-white text-sm sm:text-base focus:outline-none focus:border-[#10b981] transition-all"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#8c909f] mb-2 ml-1 tracking-widest uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]" size={18} />
              <input
                type="email"
                className="w-full bg-[#10131a] border border-[#32353c] rounded-xl py-3 sm:py-3.5 pl-12 pr-4 text-white text-sm sm:text-base focus:outline-none focus:border-[#10b981] transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#8c909f] mb-2 ml-1 tracking-widest uppercase">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]" size={18} />
              <input
                type="password"
                className="w-full bg-[#10131a] border border-[#32353c] rounded-xl py-3 sm:py-3.5 pl-12 pr-4 text-white text-sm sm:text-base focus:outline-none focus:border-[#10b981] transition-all"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-[#10b981]/20 flex items-center justify-center gap-2 group mt-2 active:scale-[0.98]"
          >
            {isLoading ? 'Synchronizing...' : 'Create Account'}
            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform hidden sm:block" />}
          </button>
        </form>

        <div className="mt-8 pt-6 sm:pt-8 border-t border-[#32353c] text-center">
          <p className="text-[#8c909f] text-sm sm:text-base">
            Already have an account? <Link to="/login" className="text-[#10b981] font-bold hover:underline">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
