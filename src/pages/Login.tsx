import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link as LinkIcon, User, Lock, ArrowRight, X } from 'lucide-react';
import { GoogleLogin, useGoogleOneTapLogin, type CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Enable Google One Tap
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => handleGoogleSuccess(credentialResponse),
    onError: () => setError('Google One Tap Failed'),
  });

  const handleRecaptcha = async (action: string) => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not yet loaded');
      return null;
    }
    const token = await executeRecaptcha(action);
    (window as any).captchaToken = token;
    return token;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await handleRecaptcha('login');
      const response = await api.post('/login', { username, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    
    setError('');
    setIsLoading(true);
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      await handleRecaptcha('google_login');
      
      const response = await api.post('/google-login', {
        google_id: decoded.sub,
        email: decoded.email,
        name: decoded.name || decoded.given_name || 'Google User'
      });
      
      login(response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10131a] p-4 sm:p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#3b82f6]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] sm:blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] sm:blur-[120px] pointer-events-none"></div>

      <div className="bg-[#1d2027] p-6 sm:p-8 md:p-10 rounded-3xl border border-[#32353c] shadow-2xl w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="bg-[#3b82f6] p-3.5 sm:p-4 rounded-2xl shadow-lg shadow-[#3b82f6]/30 mb-4 sm:mb-6">
            <LinkIcon size={28} className="text-white sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center">ShortenIt</h2>
          <p className="text-[#8c909f] mt-2 text-sm sm:text-base text-center">Secure authentication required</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm mb-6 flex items-start gap-3">
            <div className="bg-red-500/20 p-1 rounded-md shrink-0">
              <X size={14} />
            </div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#8c909f] mb-2 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]" size={18} />
              <input
                type="text"
                className="w-full bg-[#10131a] border border-[#32353c] rounded-xl py-3 sm:py-3.5 pl-12 pr-4 text-white text-sm sm:text-base focus:outline-none focus:border-[#3b82f6] transition-all"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#8c909f] mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]" size={18} />
              <input
                type="password"
                className="w-full bg-[#10131a] border border-[#32353c] rounded-xl py-3 sm:py-3.5 pl-12 pr-4 text-white text-sm sm:text-base focus:outline-none focus:border-[#3b82f6] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-[#3b82f6]/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            {isLoading ? 'Processing...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform hidden sm:block" />}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-[#32353c] flex-1"></div>
          <span className="text-[10px] font-black uppercase text-[#424754] tracking-widest">Social Entry</span>
          <div className="h-px bg-[#32353c] flex-1"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Authentication Failed')}
            theme="filled_black"
            shape="pill"
            width="100%"
          />
        </div>

        <div className="mt-8 pt-6 sm:pt-8 border-t border-[#32353c] text-center">
          <p className="text-[#8c909f] text-sm sm:text-base">
            New to ShortenIt? <Link to="/register" className="text-[#3b82f6] font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
