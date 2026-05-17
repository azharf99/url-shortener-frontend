import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  MousePointerClick, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Zap,
  Globe,
  Monitor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-[#3b82f6]/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-[#3b82f6] p-2 rounded-xl shadow-lg shadow-[#3b82f6]/20">
            <LinkIcon size={24} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight uppercase">ShortenIt</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors">Features</a>
          <a href="#" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors">Enterprise</a>
          <a href="#" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors">Developers</a>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors px-4">Sign In</Link>
              <Link 
                to="/register" 
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#3b82f6]/20 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-4 py-2 rounded-full text-[#3b82f6] text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
          <Zap size={14} className="fill-[#3b82f6]" />
          Next Generation Link Management
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
          Shorten Links. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-purple-500">Track Clicks.</span> <br />
          Scale Impact.
        </h1>
        
        <p className="max-w-2xl mx-auto text-[#8c909f] text-lg md:text-xl font-medium leading-relaxed mb-12">
          The professional way to manage and analyze your digital footprint. 
          Experience atomic precision click tracking and enterprise-grade security 
          in one powerful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link 
            to="/register" 
            className="w-full sm:w-auto bg-[#3b82f6] hover:bg-[#2563eb] text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-[#3b82f6]/30 flex items-center justify-center gap-3 group active:scale-95"
          >
            Get Started for Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3"
          >
            Live Demo
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-[#3b82f6]/20 blur-[100px] rounded-full scale-75"></div>
          <div className="relative bg-[#1d2027] border border-[#32353c] rounded-[2.5rem] p-4 shadow-2xl overflow-hidden shadow-black/80">
            <div className="bg-[#05070a] rounded-[1.5rem] overflow-hidden border border-[#32353c]">
               {/* Mock Dashboard Header */}
               <div className="h-12 border-b border-[#32353c] bg-[#1d2027]/50 flex items-center px-6 gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                 </div>
               </div>
               <div className="p-8 grid grid-cols-3 gap-6">
                 <div className="h-24 bg-[#1d2027] rounded-2xl border border-white/5 animate-pulse"></div>
                 <div className="h-24 bg-[#1d2027] rounded-2xl border border-white/5 animate-pulse delay-75"></div>
                 <div className="h-24 bg-[#1d2027] rounded-2xl border border-white/5 animate-pulse delay-150"></div>
                 <div className="col-span-3 h-48 bg-[#1d2027] rounded-3xl border border-white/5 animate-pulse delay-300"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase">Powerful Features</h2>
          <p className="text-[#8c909f] font-medium">Everything you need to manage your links at scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Atomic Precision",
              desc: "Real-time click tracking with nanosecond accuracy. Know exactly when and where your users are coming from.",
              icon: MousePointerClick,
              color: "text-[#3b82f6]",
              bg: "bg-[#3b82f6]/10"
            },
            {
              title: "Secure by Design",
              desc: "Protected by Google reCAPTCHA v3 and enterprise OAuth2. Your data is isolated and encrypted at rest.",
              icon: ShieldCheck,
              color: "text-purple-400",
              bg: "bg-purple-400/10"
            },
            {
              title: "Enterprise Ready",
              desc: "Comprehensive user management system for teams. Control access, roles, and permissions with ease.",
              icon: Layers,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-[#1d2027] border border-[#32353c] p-10 rounded-[2.5rem] hover:border-[#3b82f6]/50 transition-all group">
              <div className={`${feature.bg} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
              <p className="text-[#8c909f] font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#32353c] py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#3b82f6] p-2 rounded-xl">
                <LinkIcon size={20} className="text-white" />
              </div>
              <span className="text-lg font-black uppercase tracking-tight">ShortenIt</span>
            </div>
            <p className="text-[#424754] text-sm font-bold uppercase tracking-widest">© 2026 Modern Link Infrastructure</p>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-[#8c909f] hover:text-white transition-colors"><Globe size={20} /></a>
            <a href="#" className="text-[#8c909f] hover:text-white transition-colors"><Monitor size={20} /></a>
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase text-[#424754] tracking-widest mb-2">Product</p>
              <a href="#" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors">API</a>
              <a href="#" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase text-[#424754] tracking-widest mb-2">Legal</p>
              <a href="#" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm font-bold text-[#8c909f] hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
